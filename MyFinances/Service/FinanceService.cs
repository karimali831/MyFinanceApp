﻿using MyFinances.DTOs;
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

            var difference = (int)(Date1.Value - Date2.Value).TotalDays;
            return difference == 0 ? 0 : difference + 1;
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
