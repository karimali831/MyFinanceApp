using MyFinances.DTOs;
using MyFinances.Enums;
using MyFinances.Helpers;
using MyFinances.Model;
using MyFinances.Repository;
using MyFinances.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyFinances.Service
{
    public interface IRemindersService
    {
        Task<IEnumerable<Reminder>> GetAllAsync();
        Task AddReminder(ReminderDTO dto);
        Task HideReminder(int Id);
        Task<bool> ReminderExists(string notes);
        Task MissedEntriesAsync(IList<MissedEntries> entries, string notes, Priority priority = Priority.Low);
        Task<RemindersVM> GetNotifications(IEnumerable<FinanceVM> finances);
    }

    public class RemindersService : IRemindersService
    {
        private readonly IRemindersRepository remindersRepository;

        public RemindersService(IRemindersRepository remindersRepository)
        {
            this.remindersRepository = remindersRepository ?? throw new ArgumentNullException(nameof(remindersRepository));
        }

        public async Task<IEnumerable<Reminder>> GetAllAsync()
        {
            var reminders = await remindersRepository.GetAllAsync();

            if (reminders != null && reminders.Any())
            {
                foreach (var reminder in reminders)
                {
                    if (reminder.DueDate?.Date < DateTime.UtcNow.Date)
                    {
                        reminder.PaymentStatus = PaymentStatus.Late;
                    }
                    else if (reminder.DueDate?.Date == DateTime.UtcNow.Date)
                    {
                        reminder.PaymentStatus = PaymentStatus.DueToday;
                    }
                    else if (reminder.DueDate <= DateTime.UtcNow.Date.AddDays(7) && reminder.DueDate?.Date > DateTime.UtcNow.Date)
                    {
                        reminder.PaymentStatus = PaymentStatus.Upcoming;
                    }
                }
            }

            return reminders;
        }

        private IEnumerable<Reminder> upcomingPaymentRemindersAsync(IEnumerable<FinanceVM> finances)
        {
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

            var reminders = new List<(string Note, PaymentStatus PaymentStatus)>();

            if (latePayments.Count > 0)
            {
                reminders.Add(($"You have {latePayments.Count} late payments totalling £{Utils.ToCurrency(latePayments.Total)}", PaymentStatus.Late));
            }

            if (upcomingPayments.Count > 0)
            {
                reminders.Add(($"You have {upcomingPayments.Count} upcoming payments totalling £{Utils.ToCurrency(upcomingPayments.Total)}", PaymentStatus.Upcoming));
            }

            if (dueTodayPayments.Count > 0)
            {
                reminders.Add(($"You have {dueTodayPayments.Count} payments due today totalling £{Utils.ToCurrency(dueTodayPayments.Total)}", PaymentStatus.DueToday));
            }

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

        public async Task<RemindersVM> GetNotifications(IEnumerable<FinanceVM> finances)
        {
            var upcomingPayments = upcomingPaymentRemindersAsync(finances);
            var getReminders = await GetAllAsync();

            var reminders = getReminders
                .Concat(upcomingPayments)
                .Where(x => x.Display == true)
                .OrderBy(x => x.Sort)
                .ThenByDescending(x => x._priority);

            return new RemindersVM
            {
                OverDueReminders = reminders.Where(x => x.PaymentStatus == PaymentStatus.Late),
                DueTodayReminders = reminders.Where(x => x.PaymentStatus == PaymentStatus.DueToday),
                UpcomingReminders = reminders.Where(x => x.PaymentStatus == PaymentStatus.Upcoming)
            };
        }

        public async Task AddReminder(ReminderDTO dto)
        {
            await remindersRepository.InsertAsync(dto);
        }

        public async Task HideReminder(int Id)
        {
            await remindersRepository.HideAsync(Id);
        }

        public async Task<bool> ReminderExists(string notes)
        {
            return await remindersRepository.ReminderExists(notes);
        }

        public async Task MissedEntriesAsync(IList<MissedEntries> entries, string notes, Priority priority = Priority.Low)
        {
            if (entries.Any())
            {
                foreach (var entry in entries)
                {
                    if (entry.Dates.Any())
                    {
                        foreach (var missedDates in entry.Dates)
                        {
                            string dbNotes = string.Format("{0} {1}. ({2})", notes, entry.Name, missedDates);

                            if (!await ReminderExists(dbNotes))
                            {
                                await AddReminder(new ReminderDTO
                                {
                                    DueDate = DateTime.UtcNow,
                                    Notes = dbNotes,
                                    Priority = priority,
                                    CatId = Categories.MissedEntries
                                });
                            }
                        }
                    }
                }
            }
        }
    }
}
