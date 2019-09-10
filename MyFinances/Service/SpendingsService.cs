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
        Task<IEnumerable<Spending>> GetAllAsync(int? cat1Id, int? period);
        Task InsertAsync(SpendingDTO dto);
        Task<decimal> GetFuelIn(int daysInterval);
        DateTime? ExpenseLastPaidDate(int financeId);
        decimal GetTotalSpent(IEnumerable<Spending> spendings, int daysInterval, Categories? catId = null, Categories? secondCatId = null);
        Task<IEnumerable<SpendingSummaryDTO>> GetSpendingSummary(int period);
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

        public async Task<IEnumerable<Spending>> GetAllAsync(int? cat1Id, int? period)
        {
            var spendings = (await spendingRepository.GetAllAsync());
                
            if (cat1Id.HasValue)
            {
                spendings = spendings.Where(x => x.CatId == cat1Id.Value);
            }

            if (period.HasValue)
            {
                spendings = spendings.Where(x => DateTime.Now >= x.Date && DateTime.Now.Date <= x.Date.Date.AddDays(period.Value));
            }
            
            return spendings
                .OrderByDescending(x => x.Date)
                .ThenBy(x => x.Name)
                .ThenBy(x => x.Category);
        }


        public async Task InsertAsync(SpendingDTO dto) 
        {
            await spendingRepository.InsertAsync(dto);
        }

        public DateTime? ExpenseLastPaidDate(int financeId)
        {
            return spendingRepository.ExpenseLastPaidDate(financeId);
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

        public async Task<IEnumerable<SpendingSummaryDTO>> GetSpendingSummary(int period)
        {
            var spendingsSummary = (await spendingRepository.GetSpendingsSummaryAsync(period));

            var secondCats = spendingsSummary
                .Where(x => x.Cat2 != null)
                .GroupBy(
                    p => new { p.Cat1Id, p.Cat1 },
                    p => new { p.Cat2, p.TotalSpent },
                    (key, g) =>
                        new SpendingSummaryDTO
                        {
                            Cat1 = key.Cat1,
                            Cat1Id = key.Cat1Id,
                            TotalSpent = spendingsSummary.Where(x => x.Cat1Id == key.Cat1Id).Sum(X => X.TotalSpent),
                            SecondCats = g.Select(s => new SpendingSummaryDTO
                            {
                                Cat2 = s.Cat2,
                                TotalSpent = s.TotalSpent
                            })
                        }
                 );

            var firstCats = spendingsSummary.Where(x => x.Cat2 == null);

            return firstCats.Concat(secondCats).OrderByDescending(x => x.TotalSpent).ToArray();
        }

        public async Task<decimal> GetFuelIn(int daysInterval)
        {
            return await cnwService.GetFuelIn(daysInterval);
        }
    }
}
