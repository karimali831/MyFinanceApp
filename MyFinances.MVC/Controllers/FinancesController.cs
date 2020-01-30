using MyFinances.DTOs;
using MyFinances.Enums;
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

        public async Task<ActionResult> IncomeExpenseChart(DateFrequency frequency)
        {
            var dateFilter = new DateFilter
            {
                Frequency = frequency,
                Interval = 1
            };

            var results = await financeService.GetIncomeExpenseTotalsByMonth(dateFilter);

            return View("Chart", new ChartVM
            {
                Title = "Income Expense Chart",
                TitleDs1 = "Income",
                TitleDs2 = "Spendings",
                Type = "line",
                Action = nameof(IncomeExpenseChart),
                Frequency = frequency,
                xAxis = results.Select(x => x.MonthName).Distinct().ToArray(),
                yAxisDs1 = results.Where(x => x.Type == CategoryType.Income).Select(x => x.Total).ToArray(),
                yAxisDs2 = results.Where(x => x.Type == CategoryType.Spendings).Select(x => x.Total).ToArray()
            });
        }

        public async Task<ActionResult> SpendingsSummaryChart(DateFrequency frequency)
        {
            var dateFilter = new DateFilter
            {
                Frequency = frequency,
                Interval = 1
            };

            var results = (await spendingService.GetSpendingSummary(dateFilter)).Take(10);

            return View("Chart", new ChartVM
            {
                Title = "Top 10 Spending Expenses",
                Type = "doughnut",
                Action = nameof(SpendingsSummaryChart),
                Frequency = frequency,
                xAxis = results.Select(x => x.Cat1).ToArray(),
                yAxisDs1 = results.Select(x => x.Total).ToArray()
            });
        }

        public async Task<ActionResult> IncomesSummaryChart(DateFrequency frequency)
        {
            var dateFilter = new DateFilter
            {
                Frequency = frequency,
                Interval = 1
            };

            var results = await incomeService.GetIncomeSummaryAsync(dateFilter);

            return View("Chart", new ChartVM
            {
                Title = "Income Sources",
                Type = "doughnut",
                Action = nameof(IncomesSummaryChart),
                Frequency = frequency,
                xAxis = results.Select(x => x.Cat1).ToArray(),
                yAxisDs1 = results.Select(x => x.Total).ToArray()
            });
        }
    }
}