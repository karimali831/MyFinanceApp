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
        Task<IEnumerable<Spending>> GetAllAsync(int? catId, DateFrequency? frequency, int? interval, bool isFinance);
        Task InsertAsync(SpendingDTO dto);
        DateTime? ExpenseLastPaidDate(int financeId);
        Task<IEnumerable<SpendingSummaryDTO>> GetSpendingSummary(DateFrequency frequency, int interval);
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

        public async Task<IEnumerable<Spending>> GetAllAsync(int? catId, DateFrequency? frequency, int? interval, bool isFinance)
        {
            var spendings = (await spendingRepository.GetAllAsync(frequency, interval));
                
            if (catId.HasValue)
            {
                spendings = spendings.Where(x => (isFinance && x.FinanceId == catId.Value) || (!isFinance && x.CatId == catId.Value));
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

        public async Task<IEnumerable<SpendingSummaryDTO>> GetSpendingSummary(DateFrequency frequency, int interval)
        {
            var spendingsSummary = await spendingRepository.GetSpendingsSummaryAsync(frequency, interval);

            var secondCats = spendingsSummary
                .Where(x => x.Cat2 != null)
                .GroupBy(
                    p => new { p.CatId, p.IsFinance, p.Cat1 },
                    p => new { p.Cat2, p.TotalSpent },
                    (key, g) =>
                        new SpendingSummaryDTO
                        {
                            Cat1 = key.Cat1,
                            CatId = key.CatId,
                            IsFinance = key.IsFinance,
                            TotalSpent = spendingsSummary
                                .Where(x => x.CatId == key.CatId && x.Cat1 == key.Cat1)
                                .Sum(x => x.TotalSpent),
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
    }
}
