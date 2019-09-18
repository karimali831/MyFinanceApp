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
        Task<IEnumerable<Income>> GetAllIncomesAsync();
        Task InsertAsync(FinanceDTO dto);
        Task InsertIncomeAsync(IncomeDTO dto);
        decimal GetTotalIncome(IEnumerable<Income> incomes, int monthsInterval, Categories? sourceId = null, Categories? secondSourceId = null);
        int? CalculateDays(DateTime? Date1, DateTime? Date2);
        int? DaysLastPaid(int Id, bool calcLateDays = false);
        PaymentStatus PaymentStatusAsync(int Id, DateTime? nextDueDate);
    }

    public class FinanceService : IFinanceService
    {
        private readonly IFinanceRepository financeRepository;
        private readonly IIncomeRepository incomeRepository;
        private readonly ISpendingService spendingService; 
   
        public FinanceService(
            IFinanceRepository financeRepository, 
            IIncomeRepository incomeRepository,
            ISpendingService spendingService)
        {
            this.financeRepository = financeRepository ?? throw new ArgumentNullException(nameof(financeRepository));
            this.incomeRepository = incomeRepository ?? throw new ArgumentNullException(nameof(incomeRepository));
            this.spendingService = spendingService ?? throw new ArgumentNullException(nameof(spendingService));
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
                    if (finance.OverrideNextDueDate && finance.MonthlyDueDate.HasValue)
                    {
                        if (finance.NextDueDate == null || DateTime.Now >= finance.NextDueDate || resyncNextDueDates)
                        {
                            int monthElapsed = finance.MonthlyDueDate >= DateTime.Now.Day ? 0 : 1;
                            var dueDate = $"{DateTime.Now.AddMonths(monthElapsed).ToString("MM")}-{finance.MonthlyDueDate}-{DateTime.Now.ToString("yyyy")}";
                            var date = CalculateNextDueDate(DateTime.Parse(dueDate));
                            await financeRepository.UpdateNextDueDateAsync(date, finance.Id);
                        }
                    }
                }
            }

            return finances;
        }

        public async Task<IEnumerable<Income>> GetAllIncomesAsync()
        {
            return (await incomeRepository.GetAllAsync()).OrderByDescending(x => x.Date);
        }

        public decimal GetTotalIncome(IEnumerable<Income> incomes, int monthsInterval, Categories? sourceId, Categories? secondSourceId)
        {
            var getIncomes = incomes.Where(x => x.Date >= DateTime.Now.Date.AddMonths(monthsInterval));

            if (sourceId.HasValue)
            {
                getIncomes = getIncomes.Where(x => (Categories)x.SourceId == sourceId);
            }

            if (secondSourceId.HasValue)
            {
                getIncomes = getIncomes.Where(x => (Categories)x.SecondSourceId == secondSourceId);
            }

            return getIncomes.Sum(x => x.Amount);
        }

        public int? CalculateDays(DateTime? Date1, DateTime? Date2)
        {
            if (!Date1.HasValue || !Date2.HasValue)
            {
                return null;
            }

            return (int)(Date1.Value - Date2.Value).TotalDays + 1;
        }

        public int? DaysLastPaid(int Id, bool calcLateDays = false)
        {
            var expenseLastPaidDate = spendingService.ExpenseLastPaidDate(Id);
            return CalculateDays(calcLateDays ? DateTime.UtcNow.AddMonths(-1) : DateTime.UtcNow, expenseLastPaidDate);
        }

        public PaymentStatus PaymentStatusAsync(int Id, DateTime? nextDueDate)
        {
            if (!nextDueDate.HasValue)
            {
                return PaymentStatus.Unknown;
            }

            var daysUntilDue = CalculateDays(nextDueDate, DateTime.UtcNow);
            var daysLastPaid = DaysLastPaid(Id);
            var daysLate = DaysLastPaid(Id, true);

            if (daysUntilDue == null)
            {
                return PaymentStatus.Unknown;
            }

            if (daysLastPaid <= 7)
            {
                return PaymentStatus.Paid;
            }
            else if (daysLate > 0)
            {
                return PaymentStatus.Late;
            }
            else
            {
                if (daysUntilDue == 0)
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
