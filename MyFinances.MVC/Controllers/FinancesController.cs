using MyFinances.DTOs;
using MyFinances.Enums;
using MyFinances.Service;
using MyFinances.Website.Models;
using MyFinances.Website.ViewModels;
using System;
using System.Collections;
using System.Collections.Generic;
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

        public ActionResult SpendingSummary()
        {
            return RedirectToAction(nameof(SpendingsSummaryChart), new { frequency = DateFrequency.CurrentYear });
        }

        public ActionResult IncomeSummary()
        {
            return RedirectToAction(nameof(IncomesSummaryChart), new { frequency = DateFrequency.CurrentYear });
        }

        public async Task<ActionResult> SpendingsSummaryChart(DateFrequency frequency)
        {
            var dateFilter = new DateFilter
            {
                Frequency = frequency,
                Interval = 1
            };

            var results = (await spendingService.GetSpendingSummary(dateFilter)).Take(10);

            return View(new SummaryChartVM
            {
                Title = "Top 10 Spending Expenses",
                Frequency = frequency,
                Categories = results.Select(x => x.Cat1).ToArray(),
                Total = results.Select(x => x.Total).ToArray()
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

            return View(new SummaryChartVM
            {
                Title = "Income Sources",
                Frequency = frequency,
                Categories = results.Select(x => x.Cat1).ToArray(),
                Total = results.Select(x => x.Total).ToArray()
            });
        }


        public async Task<ActionResult> CharterColumn()
        {
            var _context = new myfinancesEntities();
            ArrayList xValue = new ArrayList();
            ArrayList yValue = new ArrayList();

            var request = new DateFilter
            {
                Frequency = Enums.DateFrequency.LastXMonths,
                Interval = 1
            };

            var results = await spendingService.GetSpendingSummary(request);

            results.ToList().ForEach(rs => xValue.Add(rs.Cat1));
            results.ToList().ForEach(rs => yValue.Add(rs.Total));

            new Chart(width: 600, height: 400, theme: ChartTheme.Green)
            .AddTitle("Chart for Finance Summary [Column Chart]")
            .AddSeries("Default", chartType: "Column", xValue: xValue, yValues: yValue)
            .Write("bmp");

            return null;
        }

        public async Task<ActionResult> ChartPie()
        {
            var _context = new myfinancesEntities();
            ArrayList xValue = new ArrayList();
            ArrayList yValue = new ArrayList();

            var request = new DateFilter
            {
                Frequency = Enums.DateFrequency.January,
                Interval = 1
            };

            var results = (await spendingService.GetSpendingSummary(request)).Take(10);

            results.ToList().ForEach(rs => xValue.Add(rs.Cat1 + " £" + rs.Total));
            results.ToList().ForEach(rs => yValue.Add(rs.Total));

            new Chart(width: 1200, height: 800, theme: ChartTheme.Green)
            .AddTitle("Spendings breakdown summary for " + request.Frequency)
            .AddSeries("Default", chartType: "Doughnut", xValue: xValue, yValues: yValue)
            .Write("bmp");

            return null;
        }
    }
}