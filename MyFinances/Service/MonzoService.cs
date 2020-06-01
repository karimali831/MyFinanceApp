using MyFinances.DTOs;
using MyFinances.Enums;
using MyFinances.Helpers;
using MyFinances.Model;
using MyFinances.Models;
using MyFinances.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyFinances.Service
{
    public interface IMonzoService
    {
        Task<IDictionary<CategoryType, (IList<string>, string Syncables)>> SyncTransactions(IList<MonzoTransaction> transactions);
        Task<IEnumerable<FinanceVM>> GetFinances();
        Task<IEnumerable<Category>> GetCategories(CategoryType? typeId);
        Task AddIncome(IncomeDTO dto);
        Task AddSpending(SpendingDTO dto);
        Task<Monzo> MonzoAccountSummary();
        Task InsertMonzoAccountSummary(Monzo accountSummary);
    }

    public class MonzoService : IMonzoService
    {
        private readonly IFinanceService financeService;
        private readonly ISpendingService spendingService;
        private readonly IIncomeService incomeService;
        private readonly IBaseService baseService;
        private readonly IRemindersService reminderService;

        public MonzoService(
            IFinanceService financeService,
            ISpendingService spendingService,
            IIncomeService incomeService,
            IRemindersService reminderService,
            IBaseService baseService)
        {
            this.financeService = financeService ?? throw new ArgumentNullException(nameof(Finance));
            this.spendingService = spendingService ?? throw new ArgumentNullException(nameof(spendingService));
            this.incomeService = incomeService ?? throw new ArgumentNullException(nameof(incomeService));
            this.baseService = baseService ?? throw new ArgumentNullException(nameof(baseService));
            this.reminderService = reminderService ?? throw new ArgumentNullException(nameof(reminderService));
        }

        private async Task<IEnumerable<string>> SpendingsMonzoTransIds()
        {
            return (await spendingService.GetAllAsync(new SpendingRequestDTO
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
        }

        private async Task<IEnumerable<string>> IncomesMonzoTransIds()
        {
            return (await incomeService.GetAllIncomesAsync(new IncomeRequestDTO
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
        }

        public async Task<IDictionary<CategoryType, (IList<string>, string Syncables)>> SyncTransactions(IList<MonzoTransaction> transactions)
        {
            var spendingIDs = new List<string>();
            var incomeIDs = new List<string>();
            var incomeSyncables = new List<string>();
            var spendingSyncables = new List<string>();
            string strStartDate = "14/05/2020"; // start date since started savings pot top-ups

            // check synced transactions
            var spendingsMonzoTransIds = await SpendingsMonzoTransIds();
            var incomesMonzoTransIds = await IncomesMonzoTransIds();
            var categories = await baseService.GetAllCategories(CategoryType.Spendings, catsWithSubs: false);

            foreach (var trans in transactions)
            {
                // debited from card
                if (trans.Amount < 0)
                {
                    if (spendingsMonzoTransIds.Contains(trans.Id))
                    {
                        spendingIDs.Add(trans.Id);
                    }
                    else
                    {
                        if (trans.Created > DateTime.Parse(strStartDate))
                        {
                            int? category = null;
                            int? secondCategory = null;
                            int? financeId = null;
                            string name = "";

                            // auto sync trans with specified categories
                            if (trans.Notes.StartsWith("#"))
                            {
                                var tranNotesCategories = trans.Notes.Split('#');
                                var cat1 = categories.FirstOrDefault(x => Utils.CleanCategory(x.Name).Equals(tranNotesCategories[1], StringComparison.OrdinalIgnoreCase));

                                if (cat1 != null)
                                { 
                                    category = cat1.Id;

                                    // there's a second category 
                                    if (tranNotesCategories.Length == 3)
                                    {
                                        var cat2 = categories.FirstOrDefault(x => Utils.CleanCategory(x.Name).Equals(tranNotesCategories[2], StringComparison.OrdinalIgnoreCase));

                                        if (cat2 != null)
                                        { 
                                            secondCategory = cat2.Id;
                                        }
                                        else
                                        {
                                            string msg = $"Unable to automatically sync transaction: {trans.Name} with matched category {cat1.Name} and unmatched second category: {tranNotesCategories[2]}";

                                            await reminderService.AddReminder(new ReminderDTO
                                            {
                                                DueDate = DateTime.UtcNow,
                                                Notes = msg,
                                                Priority = Priority.Medium,
                                                CatId = Categories.MissedEntries
                                            });

                                            baseService.ReportException(new Exception(msg));
                                        }
                                    }

                                    spendingSyncables.Add(cat1.Name);
                                    name = cat1.Name;
                                }
                                else
                                {
                                    string msg = $"Unable to automatically sync transaction: {trans.Name} with unmatched category: {tranNotesCategories[1]}";

                                    await reminderService.AddReminder(new ReminderDTO
                                    {
                                        DueDate = DateTime.UtcNow,
                                        Notes = msg,
                                        Priority = Priority.Medium,
                                        CatId = Categories.MissedEntries
                                    });

                                    baseService.ReportException(new Exception(msg));
                                }
                            }
                            else
                            {
                                // auto sync finances
                                if (trans.Description.Equals(MonzoSync.GtiRoadTax.GetDescription()))
                                {
                                    name = MonzoSync.GtiRoadTax.ToString();
                                    financeId = (int)MonzoSync.GtiRoadTax;
                                    spendingSyncables.Add(name);
                                }
                                else if (trans.Description.Equals(MonzoSync.BlueMotorFinance.GetDescription()))
                                {
                                    name = MonzoSync.BlueMotorFinance.ToString();
                                    financeId = (int)MonzoSync.BlueMotorFinance;
                                    spendingSyncables.Add(name);
                                }
                                else if (trans.Description.Equals(MonzoSync.EEPhoneBill.GetDescription()))
                                {
                                    name = MonzoSync.EEPhoneBill.ToString();
                                    financeId = (int)MonzoSync.EEPhoneBill;
                                    spendingSyncables.Add(name);
                                }

                                // auto sync pot spendings
                                else if (trans.Name.StartsWith(MonzoSync.pot_.ToString()))
                                {
                                    name = "(savings top-up)";
                                    category = (int)Categories.Savings;
                                    spendingSyncables.Add(MonzoSync.pot_.GetDescription());
                                }
                            }

                            if (category.HasValue || financeId.HasValue)
                            {
                                var dto = new SpendingDTO
                                {
                                    Name = name,
                                    Amount = (-trans.Amount / 100m),
                                    CatId = category ?? null,
                                    SecondCatId = secondCategory,
                                    Date = trans.Created,
                                    MonzoTransId = trans.Id,
                                    FinanceId = financeId ?? null
                                };

                                await spendingService.InsertAsync(dto);
                            }
                        }
                    }

                    // auto sync pot incomes
                    if (!incomesMonzoTransIds.Contains(trans.Id))
                    {
                        if (trans.Created > DateTime.Parse(strStartDate))
                        {
                            if (trans.Name.StartsWith(MonzoSync.pot_.ToString()))
                            {
                                incomeSyncables.Add(MonzoSync.pot_.GetDescription());

                                var dto = new IncomeDTO
                                {
                                    Amount = (-trans.Amount / 100m),
                                    SourceId = (int)Categories.SavingsPot,
                                    Date = trans.Created,
                                    MonzoTransId = trans.Id
                                };

                                await incomeService.InsertIncomeAsync(dto);
                            }
                        }
                    }
                }
                // credited to card
                else if (trans.Amount > 0)
                {
                    if (incomesMonzoTransIds.Contains(trans.Id))
                    {
                        incomeIDs.Add(trans.Id);
                    }
                    else
                    {
                        if (trans.Created > DateTime.Parse(strStartDate))
                        {
                            // auto sync income payables 
                            int? category = null;
                            MonzoSync transName = trans.Name.Replace(" ", "").ToEnum<MonzoSync>();

                            if (transName != default)
                            {
                                switch (transName)
                                {
                                    case MonzoSync.Pay:
                                        category = (int)Categories.CWTL;
                                        incomeSyncables.Add(MonzoSync.Pay.GetDescription());
                                        break;

                                    case MonzoSync.Amazon:
                                        category = (int)Categories.Flex;
                                        incomeSyncables.Add(MonzoSync.Amazon.GetDescription());
                                        break;

                                    case MonzoSync.Uber:
                                        category = (int)Categories.UberEats;
                                        incomeSyncables.Add(MonzoSync.Uber.GetDescription());
                                        break;
                                };
                            }

                            if (category.HasValue)
                            {
                                var dto = new IncomeDTO
                                {
                                    Amount = trans.Amount / 100m,
                                    SourceId = category.Value,
                                    Date = trans.Created,
                                    MonzoTransId = trans.Id
                                };

                                await incomeService.InsertIncomeAsync(dto);
                            }
                        }
                    }
                }
            }

            string incomeSyncablesStr = incomeSyncables.Any() ? "Incomes: " + string.Join(", ", incomeSyncables.Distinct()) : "";
            string spendingSyncablesStr = spendingSyncables.Any() ? "Spendings: " + string.Join(", ", spendingSyncables.Distinct()) : "";

            return new Dictionary<CategoryType, (IList<string>, string)>
            {
                { CategoryType.Spendings, (spendingIDs, spendingSyncablesStr) },
                { CategoryType.Income, (incomeIDs, incomeSyncablesStr) }
            };
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

        public async Task<Monzo> MonzoAccountSummary()
        {
            return await financeService.MonzoAccountSummary();
        }

        public async Task InsertMonzoAccountSummary(Monzo accountSummary)
        {
            await financeService.InsertMonzoAccountSummary(accountSummary);
        }
    }
}
