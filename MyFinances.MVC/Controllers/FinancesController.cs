using MyFinances.DTOs;
using MyFinances.Enums;
using MyFinances.Helpers;
using MyFinances.Service;
using MyFinances.Website.Models;
using MyFinances.Website.ViewModels;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;

namespace MyFinances.Website.Controllers
{
    public class FinancesController : Controller
    {
        private readonly ISpendingService spendingService;
        private readonly IIncomeService incomeService;
        private readonly IFinanceService financeService;

        public FinancesController(ISpendingService spendingService, IIncomeService incomeService, IFinanceService financeService)
        {
            this.spendingService = spendingService ?? throw new ArgumentNullException(nameof(spendingService));
            this.incomeService = incomeService ?? throw new ArgumentNullException(nameof(incomeService));
            this.financeService = financeService ?? throw new ArgumentNullException(nameof(financeService));
        }

        // GET: Finances
        public ActionResult Index()
        {
            return View();
        }

        public async Task<ActionResult> SpendingsByCategoryChart(int catId, string type, DateFrequency frequency, int interval = 1)
        {
            var dateFilter = new DateFilter
            {
                Frequency = frequency,
                Interval = interval
            };

            bool isSecondCat = type == "Subcategory" ? true : false;
            bool isFinance = type == "Finance" ? true : false;

            var results = await spendingService.GetSpendingsByCategoryAndMonthAsync(dateFilter, catId, isSecondCat, isFinance);

            return View("Chart", new ChartVM
            {
                Title = string.Format("Spendings Chart for {0} ({1})", results.First().Category, results.First().SecondCategory),
                Type = "bar",
                Action = nameof(SpendingsByCategoryChart),
                Filter = dateFilter,
                xAxis = results.Select(x => x.MonthName.Substring(0, 3)).Distinct().ToArray(),
                yAxisDs1 = results.Select(x => x.Total).ToArray(),
                Width = 300
            });
        }

        public async Task<ActionResult> IncomeExpenseChart(DateFrequency frequency, int interval = 1)
        {
            var dateFilter = new DateFilter
            {
                Frequency = frequency,
                Interval = interval
            };

            var results = await financeService.GetIncomeExpenseTotalsByMonth(dateFilter);

            return View("Chart", new ChartVM
            {
                Title = "Income Expense Chart",
                TitleDs1 = "Income",
                TitleDs2 = "Spendings",
                Type = "bar",
                Action = nameof(IncomeExpenseChart),
                Filter = dateFilter,
                xAxis = results.Select(x => x.MonthName.Substring(0, 3)).Distinct().ToArray(),
                yAxisDs1 = results.Where(x => x.Type == CategoryType.Income).Select(x => x.Total).ToArray(),
                yAxisDs2 = results.Where(x => x.Type == CategoryType.Spendings).Select(x => x.Total).ToArray(),
                Width = 350
            });
        }

        public async Task<ActionResult> SpendingsSummaryChart(DateFrequency frequency, int interval = 1)
        {
            var dateFilter = new DateFilter {
                Frequency = frequency,
                Interval = interval
            };

            var results = (await spendingService.GetSpendingSummary(dateFilter)).Take(10);

            return View("Chart", new ChartVM
            {
                Title = "Top 10 Spending Expenses",
                Type = "doughnut",
                Action = nameof(SpendingsSummaryChart),
                Filter = dateFilter,
                xAxis = results.Select(x => x.Cat1).ToArray(),
                yAxisDs1 = results.Select(x => x.Total).ToArray()
            });
        }

        public async Task<ActionResult> IncomesSummaryChart(DateFrequency frequency, int interval = 1)
        {
            var dateFilter = new DateFilter {
                Frequency = frequency,
                Interval = interval
            };

            var results = await incomeService.GetIncomeSummaryAsync(dateFilter);

            return View("Chart", new ChartVM
            {
                Title = "Income Sources",
                Type = "doughnut",
                Action = nameof(IncomesSummaryChart),
                Filter = dateFilter,
                xAxis = results.Select(x => x.Cat1).ToArray(),
                yAxisDs1 = results.Select(x => x.Total).ToArray()
            });
        }
    }
}