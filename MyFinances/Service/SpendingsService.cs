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
    public interface ISpendingService
    {
        Task<IEnumerable<Spending>> GetAllAsync(SpendingRequestDTO request);
        Task MissedCreditCardInterestEntriesAsync();
        Task<int?> GetIdFromFinanceAsync(int Id);
        Task MakeSpendingFinanceless(int id, int catId, int? secondCatId);
        Task InsertAsync(SpendingDTO dto);
        (DateTime? Date, decimal Amount) ExpenseLastPaid(int financeId);
        Task<IEnumerable<SpendingSummaryDTO>> GetSpendingSummary(DateFilter dateFilter);
        Task<IEnumerable<MonthComparisonChartVM>> GetSpendingsByCategoryAndMonthAsync(DateFilter dateFilter, int catId, bool isSecondCat, bool isFinance);
    }

    public class SpendingService : ISpendingService
    {
        private readonly ISpendingRepository spendingRepository;
        private readonly ICNWService cnwService;
        private readonly IRemindersService reminderService;

        public SpendingService(
            ISpendingRepository spendingRepository,
            ICNWService cnwService,
            IRemindersService reminderService
            )
        {
            this.spendingRepository = spendingRepository ?? throw new ArgumentNullException(nameof(spendingRepository));
            this.cnwService = cnwService ?? throw new ArgumentNullException(nameof(cnwService));
            this.reminderService = reminderService ?? throw new ArgumentNullException(nameof(reminderService));
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
        public async Task MakeSpendingFinanceless(int id, int catId, int? secondCatId)
        {
            await spendingRepository.MakeSpendingFinanceless(id, catId, secondCatId);
        }

        public async Task InsertAsync(SpendingDTO dto) 
        {
            await spendingRepository.InsertAsync(dto);
        }

        public (DateTime? Date, decimal Amount) ExpenseLastPaid(int financeId)
        {
            return spendingRepository.ExpenseLastPaid(financeId);
        }

        public async Task MissedCreditCardInterestEntriesAsync()
        {
            var creditCards = new List<string>()
            {
                "aqua",
                "vanquis",
                "barclaycard",
                "luma",
                "capital one"
            };

            var results = new List<MissedEntries>();

            foreach (var card in creditCards)
            {
                var entries = (await spendingRepository.MissedCreditCardInterestEntriesAsync(card));

                if (entries.Any())
                {
                    var data = new MissedEntries()
                    {
                        Name = card,
                        Dates = entries.Select(x => (x.Month + "/" + x.Year)).ToArray()
                    };

                    results.Add(data);
                }
            }

            await reminderService.MissedEntriesAsync(results, "You have a missed credit card interest entry for");
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
                                    }),
                        }
                 );

            var firstCats = spendingsSummary.Where(x => x.Cat2 == null);
            var data = firstCats.Concat(secondCats).OrderByDescending(x => x.Total).ToArray();

            foreach (var item in data)
            {
                if (item.Cat2 == null)
                {

                    var tt = await GetSpendingsByCategoryAndMonthAsync(dateFilter, item.CatId, false, item.IsFinance);
                    item.Average = Utils.ChartsHeaderTitle(tt, ChartHeaderTitleType.Monthly);
                }
                else
                {
                    foreach (var x in item.SecondCats)
                    {
                        var tt = await GetSpendingsByCategoryAndMonthAsync(dateFilter, x.SecondCatId, true, false);
                        item.Average = Utils.ChartsHeaderTitle(tt, ChartHeaderTitleType.Monthly);
                    }
                }
            }

            return data;
        }

        public async Task<IEnumerable<MonthComparisonChartVM>> GetSpendingsByCategoryAndMonthAsync(DateFilter dateFilter, int catId, bool isSecondCat, bool isFinance)
        {
            return await spendingRepository.GetSpendingsByCategoryAndMonthAsync(dateFilter, catId, isSecondCat, isFinance);
        }
    }
}
