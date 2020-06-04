using MyFinances.DTOs;
using MyFinances.Enums;
using MyFinances.Helpers;
using MyFinances.Model;
using MyFinances.Models;
using MyFinances.ViewModels;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Razor.Parser.SyntaxTree;

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
            .Where(x => x.MonzoTransId != null)
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
            .Where(x => x.MonzoTransId != null)
            .OrderByDescending(x => x.Date)
            .Select(x => x.MonzoTransId)
            .Take(100);
        }

        private async Task CheckMonzoTransDuplicates()
        {
            var (Name, Duplicates) = await baseService.CheckDuplicates("MonzoTransId", "Spendings");

            if (Duplicates >= 2)
            {
                string note = $"Duplicated monzo trans entries: {Duplicates} for {Name}";
                var exists = await reminderService.ReminderExists(note);

                if (!exists)
                {
                    await reminderService.AddReminder(new ReminderDTO
                    {
                        DueDate = DateTime.UtcNow,
                        Notes = note,
                        Priority = Priority.Medium,
                        CatId = Categories.MissedEntries
                    });
                }
            }
        }

        private async Task MonzoTagMismatched(string transName, string cat, string secondCat = null)
        {
            string msg = "";
            if (secondCat != null)
            {
                msg = $"Unable to automatically sync transaction: {transName} with matched category {cat} and unmatched second category: {secondCat}";
            }
            else
            {
                msg = $"Unable to automatically sync transaction: {transName} with unmatched category: {cat}";
            }

            await reminderService.AddReminder(new ReminderDTO
            {
                DueDate = DateTime.UtcNow,
                Notes = msg,
                Priority = Priority.Medium,
                CatId = Categories.MissedEntries
            });

            baseService.ReportException(new Exception(msg));
        }

        public async Task<IDictionary<CategoryType, (IList<string>, string Syncables)>> SyncTransactions(IList<MonzoTransaction> transactions)
        {
            // variable initialisation 
            var spendingIDs = new List<string>();
            var incomeIDs = new List<string>();
            var incomeSyncables = new List<string>();
            var spendingSyncables = new List<string>();
            DateTime startDate = DateTime.Parse("14/05/2020", new CultureInfo("en-GB")); // start date since started savings pot top-ups

            // check duplicates - should be unit test
            await CheckMonzoTransDuplicates();

            // check synced transactions
            var spendingsMonzoTransIds = await SpendingsMonzoTransIds();
            var incomesMonzoTransIds = await IncomesMonzoTransIds();
            var categories = (await baseService.GetAllCategories(CategoryType.Spendings, catsWithSubs: false)).Where(x => x.MonzoTag != null);
            var incomeCategories = (await baseService.GetAllCategories(CategoryType.IncomeSources, catsWithSubs: false)).Where(x => x.MonzoTag != null);
            var finances = (await GetFinances()).Where(x => x.MonzoTag != null);

            // 2020-06-01T14:15:00.119Z
            foreach (var trans in transactions)
            {
                int? category = null;
                int? secondCategory = null;
                int? financeId = null;
                string name = "";

                // debited
                if (trans.Amount < 0)
                {
                    if (spendingsMonzoTransIds.Contains(trans.Id))
                    {
                        spendingIDs.Add(trans.Id);
                    }
                    else
                    {
                        // auto sync categories
                        if (trans.Notes.StartsWith("#"))
                        {
                            var tranNotesCategories = trans.Notes.Split('#');
                            var cat1 = categories.FirstOrDefault(x => x.MonzoTag.Equals(tranNotesCategories[1], StringComparison.OrdinalIgnoreCase));

                            if (cat1 != null)
                            {
                                category = cat1.Id;

                                // there's a second category 
                                if (tranNotesCategories.Length == 3)
                                {
                                    var secondCategories = await baseService.GetAllCategories(cat1.SecondTypeId, catsWithSubs: false);
                                    var cat2 = secondCategories.FirstOrDefault(x => x.MonzoTag.Equals(tranNotesCategories[2], StringComparison.OrdinalIgnoreCase));

                                    if (cat2 != null)
                                    {
                                        secondCategory = cat2.Id;
                                    }
                                    else
                                    {
                                        await MonzoTagMismatched(trans.Name, cat1.Name, tranNotesCategories[2]);
                                    }
                                }

                                spendingSyncables.Add(cat1.Name);
                                name = cat1.Name;
                            }
                            else
                            {
                                await MonzoTagMismatched(trans.Name, tranNotesCategories[2]);
                            }
                        }
                        else
                        {
                            // auto sync finances
                            var finance = finances.FirstOrDefault(x => x.MonzoTag.Equals(trans.Description, StringComparison.OrdinalIgnoreCase));

                            if (finances != null)
                            {
                                name = finance.Name;
                                financeId = finance.Id;
                                spendingSyncables.Add(name);
                            }

                            // auto sync savings
                            if (trans.Name.StartsWith("pot_"))
                            {
                                name = "Saving pot top-ups";
                                category = (int)Categories.Savings;
                                spendingSyncables.Add(name);
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

                    // auto sync pot incomes
                    if (!incomesMonzoTransIds.Contains(trans.Id))
                    {
                        if (trans.Name.StartsWith("pot_"))
                        {
                            var dto = new IncomeDTO
                            {
                                Amount = (-trans.Amount / 100m),
                                SourceId = (int)Categories.SavingsPot,
                                Date = trans.Created,
                                MonzoTransId = trans.Id
                            };

                            incomeSyncables.Add("Saving pot top-ups");
                            await incomeService.InsertIncomeAsync(dto);
                        }
                    }
                }
                // credited
                else if (trans.Amount > 0)
                {
                    if (incomesMonzoTransIds.Contains(trans.Id))
                    {
                        incomeIDs.Add(trans.Id);
                    }
                    else
                    {
                        // auto sync incomes
                        var cat = incomeCategories.FirstOrDefault(x => x.MonzoTag.Equals(trans.Description, StringComparison.OrdinalIgnoreCase));

                        if (cat != null)
                        {
                            var dto = new IncomeDTO
                            {
                                Amount = trans.Amount / 100m,
                                SourceId = cat.Id,
                                Date = trans.Created,
                                MonzoTransId = trans.Id
                            };

                            await incomeService.InsertIncomeAsync(dto);
                            incomeSyncables.Add(cat.Name);
                        }
                        else
                        {
                            await MonzoTagMismatched(trans.Name, trans.Description);
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
