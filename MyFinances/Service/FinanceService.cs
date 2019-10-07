using MyFinances.DTOs;
using MyFinances.Enums;
using MyFinances.Model;
using MyFinances.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Nager.Date;
using Nager.Date.Extensions;

namespace MyFinances.Service
{
    public interface IFinanceService
    {
        Task<IEnumerable<Finance>> GetAllAsync(bool resyncNextDueDates);
        Task<IEnumerable<Income>> GetAllIncomesAsync(int? sourceId = null, DateFrequency? frequency = null, int? interval = null);
        Task<IEnumerable<IncomeSummaryDTO>> GetIncomeSummaryAsync(DateFrequency frequency, int interval);
        Task InsertAsync(FinanceDTO dto);
        Task InsertIncomeAsync(IncomeDTO dto);
        int? CalculateDays(DateTime? Date1, DateTime? Date2);
        int? DaysLastPaid(int Id);
        PaymentStatus PaymentStatusAsync(int Id, DateTime? nextDueDate);
    }

    public class FinanceService : IFinanceService
    {
        private readonly IFinanceRepository financeRepository;
        private readonly IIncomeRepository incomeRepository;
        private readonly ISpendingService spendingService;
        private readonly IBaseService baseService;

        public FinanceService(
            IFinanceRepository financeRepository, 
            IIncomeRepository incomeRepository,
            ISpendingService spendingService,
            IBaseService baseService)
        {
            this.financeRepository = financeRepository ?? throw new ArgumentNullException(nameof(financeRepository));
            this.incomeRepository = incomeRepository ?? throw new ArgumentNullException(nameof(incomeRepository));
            this.spendingService = spendingService ?? throw new ArgumentNullException(nameof(spendingService));
            this.baseService = baseService ?? throw new ArgumentNullException(nameof(baseService));
        }

        public DateTime CalculateNextDueDate(DateTime date)
        {
            while (DateSystem.IsPublicHoliday(date, CountryCode.GB) || date.IsWeekend(CountryCode.GB))
            {
                date = date.AddDays(1);
            }

            return date;
        }

        public async Task<IEnumerable<Finance>> GetAllAsync(bool resyncNextDueDates)
        {
            var finances = await financeRepository.GetAllAsync();

            if (finances.Any())
            {
                foreach(var finance in finances)
                {
                    var expenseLastPaidDate = spendingService.ExpenseLastPaidDate(finance.Id);

                    // delete finance if one-off payment and is paid (i.e. ManualPayment = 1)
                    if (finance.ManualPayment && DateTime.UtcNow.Date >= expenseLastPaidDate)
                    {
                        int? financePaidId = await spendingService.GetIdFromFinanceAsync(finance.Id);

                        if (financePaidId.HasValue)
                        {
                            await spendingService.MakeSpendingFinanceless(financePaidId.Value, finance.CatId);
                            await baseService.DeleteAsync(finance.Id, "Finances");
                        }
                    }

                    // auto set next due date
                    if ((finance.OverrideNextDueDate != OverrideDueDate.No || finance.NextDueDate == null) && finance.MonthlyDueDate.HasValue && finance.MonthlyDueDate != 0)
                    {
                        if (finance.NextDueDate == null || DateTime.UtcNow.Date >= finance.NextDueDate || resyncNextDueDates)
                        {
                            // don't set next due date if previous month not paid !
                            if (finance.NextDueDate == null || DateTime.UtcNow.Date >= expenseLastPaidDate)
                            { 
                                var dueDate = $"{expenseLastPaidDate.Value.Date.AddMonths(1).ToString("MM")}-{finance.MonthlyDueDate}-{DateTime.UtcNow.ToString("yyyy")}";
                                var date = DateTime.Parse(dueDate);
                                var calcDate = finance.OverrideNextDueDate == OverrideDueDate.WorkingDays ? CalculateNextDueDate(date) : date;
                                await financeRepository.UpdateNextDueDateAsync(calcDate, finance.Id);
                            }
                        }
                    }
                }
            }

            return finances;
        }

        public async Task<IEnumerable<Income>> GetAllIncomesAsync(int? sourceId, DateFrequency? frequency, int? interval)
        {
            var incomes = (await incomeRepository.GetAllAsync(frequency, interval));

            if (sourceId.HasValue)
            {
                incomes = incomes.Where(x => x.SourceId == sourceId.Value);
            }

            return incomes.OrderByDescending(x => x.Date).ThenBy(x => x.Source);
        }

        public async Task<IEnumerable<IncomeSummaryDTO>> GetIncomeSummaryAsync(DateFrequency frequency, int interval)
        {
            var incomeSummary = await incomeRepository.GetSummaryAsync(frequency, interval);

            var secondCats = incomeSummary
                .Where(x => x.SecondSource != null)
                .GroupBy(
                    p => new { p.SourceId, p.Source },
                    p => new { p.SecondSource, p.TotalIncome },
                    (key, g) =>
                        new IncomeSummaryDTO
                        {
                            Source = key.Source,
                            SourceId = key.SourceId,
                            TotalIncome = incomeSummary
                                .Where(x => x.SourceId == key.SourceId && x.Source == key.Source)
                                .Sum(x => x.TotalIncome),
                                    SecondCats = g.Select(s => new IncomeSummaryDTO
                                    {
                                        SecondSource = s.SecondSource,
                                        TotalIncome = s.TotalIncome
                                    })
                        }
                 );

            var firstCats = incomeSummary.Where(x => x.SecondSource == null);

            return firstCats.Concat(secondCats).OrderByDescending(x => x.TotalIncome).ToArray();
        }

        public int? CalculateDays(DateTime? Date1, DateTime? Date2)
        {
            if (!Date1.HasValue || !Date2.HasValue)
            {
                return null;
            }

            return (int)(Date1.Value.Date - Date2.Value.Date).TotalDays;
        }

        public int? DaysLastPaid(int Id)
        {
            var expenseLastPaidDate = spendingService.ExpenseLastPaidDate(Id);
            return CalculateDays(DateTime.UtcNow, expenseLastPaidDate);
        }

        public PaymentStatus PaymentStatusAsync(int Id, DateTime? nextDueDate)
        {
            if (!nextDueDate.HasValue)
            {
                return PaymentStatus.Unknown;
            }

            var daysUntilDue = CalculateDays(nextDueDate, DateTime.UtcNow);
            var daysLastPaid = DaysLastPaid(Id);

            if (daysUntilDue == null)
            {
                return PaymentStatus.Unknown;
            }

            if (daysLastPaid <= 7)
            {
                return PaymentStatus.Paid;
            }
            else if (daysUntilDue < 0)
            {
                return PaymentStatus.Late;
            }
            else if (daysUntilDue == 0)
            {
                return PaymentStatus.DueToday;
            }
            else if (daysUntilDue > 0)
            {
                return PaymentStatus.Upcoming;
            }
            else
            {
                return PaymentStatus.Unknown;
            }
        }

        public async Task InsertAsync(FinanceDTO dto)
        {
            await financeRepository.InsertAsync(dto);
        }

        public async Task InsertIncomeAsync(IncomeDTO dto)
        {
            await incomeRepository.InsertAsync(dto);
        }
    }
}
