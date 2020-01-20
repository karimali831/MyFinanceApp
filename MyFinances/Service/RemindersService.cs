using MyFinances.DTOs;
using MyFinances.Enums;
using MyFinances.Model;
using MyFinances.Repository;
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
    }
}
