using MyFinances.DTOs;
using MyFinances.Enums;
using MyFinances.Model;
using MyFinances.ViewModels;
using MyFinances.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Nager.Date;
using Nager.Date.Extensions;

namespace MyFinances.Service
{
    public interface IIncomeService
    {
        Task<IEnumerable<Income>> GetAllIncomesAsync(IncomeRequestDTO request);
        Task<IEnumerable<IncomeSummaryDTO>> GetIncomeSummaryAsync(DateFilter dateFilter);
        Task InsertIncomeAsync(IncomeDTO dto);
        Task MissedIncomeEntriesAsync();
    }

    public class IncomeService : IIncomeService
    {
        private readonly IFinanceRepository financeRepository;
        private readonly IIncomeRepository incomeRepository;
        private readonly ISpendingService spendingService;
        private readonly IRemindersService remindersService;
        private readonly IBaseService baseService;
        private readonly IRemindersService reminderService;

        public IncomeService(
            IFinanceRepository financeRepository,
            IIncomeRepository incomeRepository,
            ISpendingService spendingService,
            IRemindersService remindersService,
            IBaseService baseService,
            IRemindersService reminderService)
        {
            this.financeRepository = financeRepository ?? throw new ArgumentNullException(nameof(financeRepository));
            this.incomeRepository = incomeRepository ?? throw new ArgumentNullException(nameof(incomeRepository));
            this.spendingService = spendingService ?? throw new ArgumentNullException(nameof(spendingService));
            this.remindersService = remindersService ?? throw new ArgumentNullException(nameof(remindersService));
            this.baseService = baseService ?? throw new ArgumentNullException(nameof(baseService));
            this.reminderService = reminderService ?? throw new ArgumentNullException(nameof(reminderService));
        }

        public DateTime CalculateNextDueDate(DateTime date)
        {
            while (DateSystem.IsPublicHoliday(date, CountryCode.GB) || date.IsWeekend(CountryCode.GB))
            {
                date = date.AddDays(1);
            }

            return date;
        }


        public async Task<IEnumerable<Income>> GetAllIncomesAsync(IncomeRequestDTO request)
        {
            var incomes = (await incomeRepository.GetAllAsync(request.DateFilter));

            if (request.SourceId.HasValue)
            {
                incomes = incomes.Where(x => request.IsSecondCat ? x.SecondSourceId == request.SourceId.Value : x.SourceId == request.SourceId.Value);
            }

            return incomes.OrderByDescending(x => x.Date).ThenBy(x => x.Source);
        }

        public async Task<IEnumerable<IncomeSummaryDTO>> GetIncomeSummaryAsync(DateFilter dateFilter)
        {
            var incomeSummary = await incomeRepository.GetSummaryAsync(dateFilter);

            var secondCats = incomeSummary
                .Where(x => x.Cat2 != null)
                .GroupBy(
                    p => new { p.CatId, p.Cat1 },
                    p => new { p.SecondCatId, p.Cat2, p.Total },
                    (key, g) =>
                        new IncomeSummaryDTO
                        {
                            Cat1 = key.Cat1,
                            CatId = key.CatId,
                            Total = incomeSummary
                                .Where(x => x.CatId == key.CatId && x.Cat1 == key.Cat1)
                                .Sum(x => x.Total),
                                    SecondCats = g.Select(s => new IncomeSummaryDTO
                                    {
                                        SecondCatId = s.SecondCatId,
                                        Cat2 = s.Cat2,
                                        Total = s.Total
                                    })
                        }
                 );

            var firstCats = incomeSummary.Where(x => x.Cat2 == null);

            return firstCats.Concat(secondCats).OrderByDescending(x => x.Total).ToArray();
        }


        public async Task MissedIncomeEntriesAsync()
        {
            var incomeStreams = new List<CategoryType>()
            {
                CategoryType.CWTL,
                CategoryType.UberEats
            };

            var results = new List<MissedEntries>();

            foreach (var incomeStream in incomeStreams)
            {
                var entries = (await incomeRepository.MissedIncomeEntriesAsync(incomeStream));

                if (entries.Any())
                {
                    var data = new MissedEntries()
                    {
                        Name = incomeStream.ToString(),
                        Dates = entries.Select(x => ( x.Month + "/" + x.Year + " Week: " + x.Week)).ToArray()
                    };

                    results.Add(data);
                }
            }

            await reminderService.MissedEntriesAsync(results, "You have a missed income entry for");
        }

        public async Task InsertIncomeAsync(IncomeDTO dto)
        {
            await incomeRepository.InsertAsync(dto);
        }
    }
}
