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
        Task<IEnumerable<Spending>> GetAllAsync(SpendingRequestDTO request);
        Task<int?> GetIdFromFinanceAsync(int Id);
        Task MakeSpendingFinanceless(int id, int catId);
        Task InsertAsync(SpendingDTO dto);
        DateTime? ExpenseLastPaidDate(int financeId);
        Task<IEnumerable<SpendingSummaryDTO>> GetSpendingSummary(DateFilter dateFilter);
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

        public async Task<IEnumerable<Spending>> GetAllAsync(SpendingRequestDTO request)
        {
            var spendings = (await spendingRepository.GetAllAsync(request.DateFilter));
                
            if (request.CatId.HasValue)
            {
                spendings = spendings.Where(x => (request.IsFinance && x.FinanceId == request.CatId.Value) || (!request.IsFinance && (request.IsSecondCat ? x.SecondCatId == request.CatId.Value : x.CatId == request.CatId.Value)));
            }
            
            return spendings
                .OrderByDescending(x => x.Date)
                .ThenBy(x => x.Name)
                .ThenBy(x => x.Category);
        }

        public async Task<int?> GetIdFromFinanceAsync(int Id)
        {
            return await spendingRepository.GetIdFromFinanceAsync(Id);
        }

        // if finance is a one-off payment, we need to delete the finance once its paid
        // but not delete the item from spendings table. so we need to set catId accordingly
        // getting the value from the finance table and then set financeId to null
        public async Task MakeSpendingFinanceless(int id, int catId)
        {
            await spendingRepository.MakeSpendingFinanceless(id, catId);
        }

        public async Task InsertAsync(SpendingDTO dto) 
        {
            await spendingRepository.InsertAsync(dto);
        }

        public DateTime? ExpenseLastPaidDate(int financeId)
        {
            return spendingRepository.ExpenseLastPaidDate(financeId);
        }

        public async Task<IEnumerable<SpendingSummaryDTO>> GetSpendingSummary(DateFilter dateFilter)
        {
            var spendingsSummary = await spendingRepository.GetSpendingsSummaryAsync(dateFilter);

            var secondCats = spendingsSummary
                .Where(x => x.Cat2 != null)
                .GroupBy(
                    p => new { p.CatId, p.Cat1, p.IsFinance },
                    p => new { p.SecondCatId, p.Cat2, p.Total },
                    (key, g) =>
                        new SpendingSummaryDTO
                        {
                            Cat1 = key.Cat1,
                            CatId = key.CatId,
                            IsFinance = key.IsFinance,
                            Total = spendingsSummary
                                .Where(x => x.CatId == key.CatId && x.Cat1 == key.Cat1)
                                .Sum(x => x.Total),
                                    SecondCats = g.Select(s => new SpendingSummaryDTO
                                    {
                                        SecondCatId = s.SecondCatId,
                                        Cat2 = s.Cat2,
                                        Total = s.Total
                                    })
                        }
                 );

            var firstCats = spendingsSummary.Where(x => x.Cat2 == null);

            return firstCats.Concat(secondCats).OrderByDescending(x => x.Total).ToArray();
        }
    }
}
