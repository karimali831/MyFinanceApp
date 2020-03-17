using MyFinances.DTOs;
using MyFinances.Enums;
using MyFinances.Helpers;
using MyFinances.Service;
using MyFinances.ViewModels;
using MyFinances.Website.Controllers.Api;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;

namespace MyFinances.Website.Controllers.API
{
    [RoutePrefix("api/finances")]
    [EnableCors(origins: "http://localhost:3000", headers: "*", methods: "*")]
    [CamelCaseControllerConfig]
    public class FinancesController : ApiController
    {
        private readonly IFinanceService financeService;

        public FinancesController( IFinanceService financeService)
        {
            this.financeService = financeService ?? throw new ArgumentNullException(nameof(financeService));
        }

        [Route("{resyncNextDueDates}/{upcomingPayments}")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetFinancesAsync(bool resyncNextDueDates, bool upcomingPayments)
        {
            var finances = await financeService.GetFinances(resyncNextDueDates);

            if (upcomingPayments)
            {
                finances = finances.Where(x => x.NextDueDate <= DateTime.UtcNow.Date.AddDays(7) || x.ManualPayment);
            }

            return Request.CreateResponse(HttpStatusCode.OK, new {
                Finances =
                    finances.Select(x => new
                    {
                        x.Id,
                        x.Name,
                        x.AvgMonthlyAmount,
                        x.Remaining,
                        x.MonthlyDueDate,
                        x.OverrideNextDueDate,
                        x.ManualPayment,
                        x.DaysUntilDue,
                        x.PaymentStatus,
                        EndDate = x.EndDate.HasValue ? x.EndDate.Value.ToString("dd-MM-yy") : null,
                        NextDueDate = x.NextDueDate.HasValue ? x.NextDueDate.Value.ToLongDateString() : null
                    })
            });
        }

        [Route("add")]
        [HttpPost]
        public async Task<HttpResponseMessage> InsertAsync(FinanceDTO model)
        {
            await financeService.InsertAsync(model);
            return Request.CreateResponse(HttpStatusCode.OK, true);
        }

        [Route("chart/incomeexpense")]
        [HttpPost]
        public async Task<HttpResponseMessage> IncomeExpenseComparisonChart(MonthComparisonChartRequestDTO request)
        {
            var results = await financeService.GetIncomeExpenseTotalsByMonth(request.DateFilter);
  
            var summary = new ChartSummaryVM
            {
                TitleDs1 = "Spendings Summary",
                TitleDs2 = "Income Summary",
                AveragedDailyDs1 = Utils.ChartsHeaderTitle(results.Where(x => x.Type == CategoryType.Spendings), ChartHeaderTitleType.Daily),
                AveragedDailyDs2 = Utils.ChartsHeaderTitle(results.Where(x => x.Type == CategoryType.Income), ChartHeaderTitleType.Daily),
                AveragedMonthlyDs1 = Utils.ChartsHeaderTitle(results.Where(x => x.Type == CategoryType.Spendings), ChartHeaderTitleType.Monthly),
                AveragedMonthlyDs2 = Utils.ChartsHeaderTitle(results.Where(x => x.Type == CategoryType.Income), ChartHeaderTitleType.Monthly),
                TotalSpentDs1 = Utils.ChartsHeaderTitle(results.Where(x => x.Type == CategoryType.Spendings), ChartHeaderTitleType.Total),
                TotalSpentDs2 = Utils.ChartsHeaderTitle(results.Where(x => x.Type == CategoryType.Income), ChartHeaderTitleType.Total)
            };

            return Request.CreateResponse(HttpStatusCode.OK,
                new ChartVM
                {
                    Summary = summary,
                    Data = results
                });
        }

        [Route("chart")]
        [HttpPost]
        public async Task<HttpResponseMessage> FinancesChartAsync(MonthComparisonChartRequestDTO request)
        {
            var results = await financeService.GetFinanceTotalsByMonth(request);

            var summary = new ChartSummaryVM
            {
                AveragedDailyDs1 = Utils.ChartsHeaderTitle(results, ChartHeaderTitleType.Daily),
                AveragedMonthlyDs1 = Utils.ChartsHeaderTitle(results, ChartHeaderTitleType.Monthly),
                TotalSpentDs1 = Utils.ChartsHeaderTitle(results, ChartHeaderTitleType.Total),
            };
 
            return Request.CreateResponse(HttpStatusCode.OK, new ChartVM
            {
                Summary = summary,
                Data = results
            });
        }
    }
}
