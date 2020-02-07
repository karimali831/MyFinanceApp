using MyFinances.DTOs;
using MyFinances.Enums;
using MyFinances.Model;
using MyFinances.ViewModels;
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
        Task<FinanceNotificationVM> GetNotifications();
        Task<IEnumerable<FinanceVM>> GetFinances(bool resyncNextDueDates);
        Task InsertAsync(FinanceDTO dto);
        int? CalculateDays(DateTime? Date1, DateTime? Date2);
        int? DaysLastPaid(int Id);
        PaymentStatus PaymentStatusAsync(int Id, DateTime? nextDueDate);
        Task<IEnumerable<IncomeExpenseVM>> GetIncomeExpenseTotalsByMonth(DateFilter filter);
        Task<IEnumerable<Reminder>> UpcomingPaymentRemindersAsync();
    }

    public class FinanceService : IFinanceService
    {
        private readonly IFinanceRepository financeRepository;
        private readonly ISpendingService spendingService;
        private readonly IRemindersService remindersService;
        private readonly IIncomeService incomeService;
        private readonly IBaseService baseService;

        public FinanceService(
            IFinanceRepository financeRepository,
            ISpendingService spendingService,
            IRemindersService remindersService,
            IBaseService baseService,
            IIncomeService incomeService)
        {
            this.financeRepository = financeRepository ?? throw new ArgumentNullException(nameof(financeRepository));
            this.spendingService = spendingService ?? throw new ArgumentNullException(nameof(spendingService));
            this.remindersService = remindersService ?? throw new ArgumentNullException(nameof(remindersService));
            this.baseService = baseService ?? throw new ArgumentNullException(nameof(baseService));
            this.incomeService = incomeService ?? throw new ArgumentNullException(nameof(incomeService));
        }

        public DateTime CalculateNextDueDate(DateTime date)
        {
            while (DateSystem.IsPublicHoliday(date, CountryCode.GB) || date.IsWeekend(CountryCode.GB))
            {
                date = date.AddDays(1);
            }

            return date;
        }

        public async Task<IEnumerable<FinanceVM>> GetFinances(bool resyncNextDueDates)
        {
            return (await GetAllAsync(resyncNextDueDates))
                .Select(x => new FinanceVM
                {
                    Id = x.Id,
                    Name = x.Name,
                    AvgMonthlyAmount = x.AvgMonthlyAmount,
                    Remaining = x.Remaining,
                    MonthlyDueDate = x.MonthlyDueDate,
                    EndDate = x.EndDate,
                    NextDueDate = x.NextDueDate,
                    OverrideNextDueDate = x.OverrideNextDueDate,
                    ManualPayment = x.ManualPayment,
                    DaysUntilDue = CalculateDays(x.NextDueDate, DateTime.UtcNow),
                    PaymentStatus = PaymentStatusAsync(x.Id, x.NextDueDate)
                })
                .OrderByDescending(x => x.PaymentStatus)
                .ThenByDescending(x => (x.PaymentStatus == PaymentStatus.Late ? x.DaysUntilDue : null))
                .ThenBy(x => (x.PaymentStatus == PaymentStatus.Upcoming ? x.DaysUntilDue : null))
                .ThenBy(x => x.Name);
        }

        public async Task<IEnumerable<Reminder>> UpcomingPaymentRemindersAsync()
        {
            var finances = await GetFinances(resyncNextDueDates: false);

            (int Count, decimal Total) latePayments = (finances
                    .Count(x => x.PaymentStatus == PaymentStatus.Late), finances
                    .Where(x => x.PaymentStatus == PaymentStatus.Late)
                    .Sum(x => x.AvgMonthlyAmount));

            (int Count, decimal Total) upcomingPayments = (finances
                    .Count(x => x.PaymentStatus == PaymentStatus.Upcoming && (x.NextDueDate <= DateTime.UtcNow.Date.AddDays(7) || x.ManualPayment)), finances
                    .Where(x => x.PaymentStatus == PaymentStatus.Upcoming && (x.NextDueDate <= DateTime.UtcNow.Date.AddDays(7) || x.ManualPayment))
                    .Sum(x => x.AvgMonthlyAmount));

            (int Count, decimal Total) dueTodayPayments = (finances
                    .Count(x => x.PaymentStatus == PaymentStatus.DueToday), finances
                    .Where(x => x.PaymentStatus == PaymentStatus.DueToday)
                    .Sum(x => x.AvgMonthlyAmount));

            var reminders = new List<(string Note, PaymentStatus PaymentStatus)>
            {
                ($"You have {latePayments.Count} late payments totalling £{latePayments.Total}", PaymentStatus.Late),
                ($"You have {upcomingPayments.Count} upcoming payments totalling £{upcomingPayments.Total}", PaymentStatus.Upcoming),
                ($"You have {dueTodayPayments.Count} payments due today totalling £{dueTodayPayments.Total}", PaymentStatus.DueToday)
            };

            var paymentReminders = new List<Reminder>();
 
            foreach (var reminder in reminders)
            {
                paymentReminders.Add(new Reminder
                {
                    Notes = reminder.Note,
                    PaymentStatus = reminder.PaymentStatus,
                    _priority = Priority.High,
                    Category = Categories.Bills.ToString(),
                    Display = true,
                    Sort = 0
                });
            }

            return paymentReminders;
        }

        public async Task<FinanceNotificationVM> GetNotifications()
        {
            await spendingService.MissedCreditCardInterestEntriesAsync();
            await incomeService.MissedIncomeEntriesAsync();

            var upcomingPayments = await UpcomingPaymentRemindersAsync();
            var getReminders = await remindersService.GetAllAsync();

            var reminders = getReminders
                .Concat(upcomingPayments)
                .Where(x => x.Display == true)
                .OrderBy(x => x.Sort)
                .ThenByDescending(x => x._priority);

            return new FinanceNotificationVM
            {
                OverDueReminders = reminders.Where(x => x.PaymentStatus == PaymentStatus.Late),
                DueTodayReminders = reminders.Where(x => x.PaymentStatus == PaymentStatus.DueToday),
                UpcomingReminders = reminders.Where(x => x.PaymentStatus == PaymentStatus.Upcoming)
            };
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
                    if (finance.ManualPayment && (!expenseLastPaidDate.HasValue || DateTime.UtcNow.Date >= expenseLastPaidDate.Value))
                    {
                        int? financePaidId = await spendingService.GetIdFromFinanceAsync(finance.Id);

                        if (financePaidId.HasValue)
                        {
                            await spendingService.MakeSpendingFinanceless(financePaidId.Value, finance.CatId);
                            await baseService.DeleteAsync(finance.Id, "Finances");
                        }
                    }

                    // auto set next due date - refactor this!v 
                    if ((finance.OverrideNextDueDate != OverrideDueDate.No || finance.NextDueDate == null) && finance.MonthlyDueDate.HasValue && finance.MonthlyDueDate != 0)
                    {
                        if (finance.NextDueDate == null || DateTime.UtcNow.Date >= finance.NextDueDate || resyncNextDueDates)
                        {
                            // don't set next due date if previous month not paid !
                            if (finance.NextDueDate == null || !expenseLastPaidDate.HasValue || DateTime.UtcNow.Date >= expenseLastPaidDate.Value)
                            {
                                int monthElapsed = finance.MonthlyDueDate >= DateTime.UtcNow.Day ? 0 : 1;
                                var previousDueDate = expenseLastPaidDate.HasValue ? expenseLastPaidDate.Value.Date : DateTime.UtcNow;
                                var nextDueMonth = expenseLastPaidDate.HasValue ? previousDueDate.AddMonths(1).Month : previousDueDate.AddMonths(monthElapsed).Month;
                
                                // i.e. 31/10/2019 cannot set next due date to 31/11/2019 so check last day of the month
                                var lastDayInPreviousMonth = DateTime.DaysInMonth(DateTime.UtcNow.Year, previousDueDate.Month);
                                var lastDayInNextMonth = DateTime.DaysInMonth(DateTime.UtcNow.Year, nextDueMonth);

                                if (previousDueDate.Day == lastDayInPreviousMonth && lastDayInPreviousMonth > lastDayInNextMonth)
                                {
                                    finance.MonthlyDueDate = lastDayInNextMonth;
                                }

                                var nextDueDate = $"{nextDueMonth}-{finance.MonthlyDueDate}-{DateTime.UtcNow.ToString("yyyy")}";

                                var date = DateTime.Parse(nextDueDate);
                                var calcDate = finance.OverrideNextDueDate == OverrideDueDate.WorkingDays ? CalculateNextDueDate(date) : date;
                                await financeRepository.UpdateNextDueDateAsync(calcDate, finance.Id);
                            }
                        }
                    }
                }
            }

            return finances;
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

        public async Task<IEnumerable<IncomeExpenseVM>> GetIncomeExpenseTotalsByMonth(DateFilter filter)
        {
            return await financeRepository.GetIncomeExpenseTotalsByMonth(filter);
        }

        public async Task InsertAsync(FinanceDTO dto)
        {
            await financeRepository.InsertAsync(dto);
        }
    }
}
