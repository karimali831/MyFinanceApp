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
        Task<decimal> GetFuelIn(int daysInterval);
        DateTime? ExpenseLastPaidDate(int financeId);
        Task<decimal> GetTotalSpent(IEnumerable<Spending> spendings, int daysInterval, Categories? catId = null, Categories? secondCatId = null);
    }

    public class SpendingService : ISpendingService
    {
        private readonly ISpendingRepository spendingRepository;
        private readonly ICNWService cnwService;

        public SpendingService(
            ISpendingRepository spendingRepository,
            ICNWService cnwService)
        {
            this.spendingRepository = spendingRepository ?? throw new ArgumentNullException(nameof(spendingRepository));
            this.cnwService = cnwService ?? throw new ArgumentNullException(nameof(cnwService));
        }

        public async Task<IEnumerable<Spending>> GetAllAsync()
        {
            return await spendingRepository.GetAllAsync();
        }


        public async Task InsertAsync(SpendingDTO dto) 
        {
            await spendingRepository.InsertAsync(dto);
        }

        public DateTime? ExpenseLastPaidDate(int financeId)
        {
            return spendingRepository.ExpenseLastPaidDate(financeId);
        }

        public async Task<decimal> GetTotalSpent(IEnumerable<Spending> spendings, int daysInterval, Categories? catId, Categories? secondCatId) 
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

            decimal fuelIn = 0;
            if (catId == Categories.Fuel)
            {
                fuelIn = await GetFuelIn(daysInterval);
            }

            return getSpendings.Sum(x => x.Amount) - fuelIn;
        }

        public async Task<decimal> GetFuelIn(int daysInterval)
        {
            return await cnwService.GetFuelIn(daysInterval);
        }
    }
}
