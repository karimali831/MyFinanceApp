using MyFinances.DTOs;
using MyFinances.Enums;
using MyFinances.Model;
using MyFinances.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyFinances.Service
{
    public interface IMonzoService
    {
        Task<IList<string>> SyncTransactions(IList<MonzoTransaction> transactions);
        Task<IEnumerable<FinanceVM>> GetFinances();
        Task<IEnumerable<Category>> GetCategories(CategoryType? typeId);
        Task AddIncome(IncomeDTO dto);
        Task AddSpending(SpendingDTO dto);
    }

    public class MonzoService : IMonzoService
    {
        private readonly IFinanceService financeService;
        private readonly ISpendingService spendingService;
        private readonly IIncomeService incomeService;
        private readonly IBaseService baseService;

        public MonzoService(
            IFinanceService financeService,
            ISpendingService spendingService,
            IIncomeService incomeService,
            IBaseService baseService)
        {
            this.financeService = financeService ?? throw new ArgumentNullException(nameof(Finance));
            this.spendingService = spendingService ?? throw new ArgumentNullException(nameof(spendingService));
            this.incomeService = incomeService ?? throw new ArgumentNullException(nameof(incomeService));
            this.baseService = baseService ?? throw new ArgumentNullException(nameof(baseService));
        }

        public async Task<IList<string>> SyncTransactions(IList<MonzoTransaction> transactions)
        {
            // check synced transactions
            var spendingsMonzoTransIds = (await spendingService.GetAllAsync(new SpendingRequestDTO
            {
                DateFilter = new DateFilter
                {
                    Frequency = DateFrequency.AllTime,
                    Interval = 1
                }
            }))
            .OrderByDescending(x => x.Date)
            .Select(x => x.MonzoTransId)
            .Take(100);

            var incomesMonzoTransIds = (await incomeService.GetAllIncomesAsync(new IncomeRequestDTO
            {
                DateFilter = new DateFilter
                {
                    Frequency = DateFrequency.AllTime,
                    Interval = 1
                }
            }))
            .OrderByDescending(x => x.Date)
            .Select(x => x.MonzoTransId)
            .Take(100);

            var syncedTransactions = new List<string>();

            foreach (var trans in transactions)
            {
                if (trans.Amount < 0)
                {
                    if (spendingsMonzoTransIds.Contains(trans.Id))
                    {
                        syncedTransactions.Add(trans.Id);
                    }
                }
                else
                {
                    if (incomesMonzoTransIds.Contains(trans.Id))
                    {
                        syncedTransactions.Add(trans.Id);
                    }
                    else
                    {
                        await Task.Run(async () =>
                        {

                            // auto sync income payables 
                            int? category = trans.Name switch
                            {
                                "PAY" => (int)Categories.CWTL,
                                "Amazon" => (int)Categories.Flex,
                                _ => null,
                            };

                            if (category.HasValue)
                            {
                                var dto = new IncomeDTO
                                {
                                    Amount = trans.Amount,
                                    SourceId = category.Value,
                                    Date = trans.Created,
                                    MonzoTransId = trans.Id
                                };

                                await incomeService.InsertIncomeAsync(dto);
                            }
                        });
                    }
                }
            }

            return syncedTransactions;
        }

        public async Task<IEnumerable<FinanceVM>> GetFinances()
        {
            return await financeService.GetFinances(resyncNextDueDates: false);
        }

        public async Task<IEnumerable<Category>> GetCategories(CategoryType? typeId)
        {
            return await baseService.GetAllCategories(typeId, catsWithSubs: false);
        }

        public async Task AddIncome(IncomeDTO dto)
        {
            await incomeService.InsertIncomeAsync(dto);
        }

        public async Task AddSpending(SpendingDTO dto)
        {
            await spendingService.InsertAsync(dto);
        }
    }
}
