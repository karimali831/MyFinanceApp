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
        bool CheckExpenseIsPaid(int financeId);
        decimal GetTotalSpent(IEnumerable<Spending> spendings, int daysInterval, Categories? catId = null, Categories? secondCatId = null);
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

        public bool CheckExpenseIsPaid(int financeId)
        {
            return spendingRepository.PaidWithinLastWeek(financeId);
        }

        public decimal GetTotalSpent(IEnumerable<Spending> spendings, int daysInterval, Categories? catId, Categories? secondCatId) 
        {
            var getSpendings = spendings.Where(x => x.Date >= DateTime.Now.Date.AddDays(daysInterval));
                
            if (catId.HasValue)
            {
                getSpendings = getSpendings.Where(x => (Categories)x.CatId == catId);
            }

            if (secondCatId.HasValue)
            {
                getSpendings = getSpendings.Where(x => (Categories)x.SecondCatId == secondCatId);
            }

            return getSpendings.Sum(x => x.Amount);
        }
    }
}
