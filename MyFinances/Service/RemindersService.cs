using MyFinances.DTOs;
using MyFinances.Enums;
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
    }

    public class RemindersService : IRemindersService
    {
        public readonly IRemindersRepository remindersRepository; 

        public RemindersService(IRemindersRepository remindersRepository)
        {
            this.remindersRepository = remindersRepository ?? throw new ArgumentNullException(nameof(remindersRepository));

        }

        public async Task<IEnumerable<Reminder>> GetAllAsync()
        {
            return await remindersRepository.GetAllAsync();
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
                                    CatId = CategoryType.MissedEntries
                                });
                            }
                        }
                    }
                }
            }
        }
    }
}
