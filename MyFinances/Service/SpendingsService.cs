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
    public interface ISpendingService
    {
        Task<IEnumerable<Spending>> GetAllAsync();
        Task InsertAsync(SpendingDTO dto);
        decimal GetTotalSpent(IEnumerable<Spending> spendings, int daysInterval);
    }

    public class SpendingService : ISpendingService
    {
        private readonly ISpendingRepository spendingRepository;

        public SpendingService(ISpendingRepository spendingRepository)
        {
            this.spendingRepository = spendingRepository ?? throw new ArgumentNullException(nameof(spendingRepository));
        }

        public async Task<IEnumerable<Spending>> GetAllAsync()
        {
            return await spendingRepository.GetAllAsync();
        }

        public async Task InsertAsync(SpendingDTO dto)
        {
            await spendingRepository.InsertAsync(dto);
        }

        public decimal GetTotalSpent(IEnumerable<Spending> spendings, int daysInterval) 
        {
            return spendings.Where(x => x.Date >= DateTime.Now.Date.AddDays(daysInterval)).Sum(x => x.Amount);
        }
    }
}
