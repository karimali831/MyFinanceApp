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
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;

namespace MyIncomes.Website.Controllers.API
{
    [RoutePrefix("api/incomes")]
    [EnableCors(origins: "http://localhost:3000", headers: "*", methods: "*")]
    [CamelCaseControllerConfig]
    public class IncomesController : ApiController
    {
        private readonly IIncomeService incomeService;

        public IncomesController(IIncomeService incomeService)
        {
            this.incomeService = incomeService ?? throw new ArgumentNullException(nameof(incomeService));
        }


        [Route("")]
        [HttpPost]
        public async Task<HttpResponseMessage> GetIncomesAsync(IncomeRequestDTO request)
        {
            var incomes = await incomeService.GetAllIncomesAsync(request);

            return Request.CreateResponse(HttpStatusCode.OK, new {
                Incomes = 
                    incomes.Select(x => new
                    {
                        x.Id,
                        x.Source,
                        x.SecondSource, 
                        Date = x.Date.ToString("MM/dd/yyyy"),
                        x.Amount,
                        x.WeekNo
                    })
            });
        }

        [Route("summary")]
        [HttpPost]
        public async Task<HttpResponseMessage> GetIncomesSummaryAsync(DateFilter dateFilter)
        {
            if (DateTime.TryParseExact(dateFilter.FromDateRange.ToString(), "dd-MM-yy", new CultureInfo("en-GB"), DateTimeStyles.None, out DateTime fromDateRange))
            {
                dateFilter.FromDateRange = fromDateRange;
            }

            if (DateTime.TryParseExact(dateFilter.ToDateRange.ToString(), "dd-MM-yy", new CultureInfo("en-GB"), DateTimeStyles.None, out DateTime toDateRange))
            {
                dateFilter.ToDateRange = toDateRange;
            }

            var incomeSummary = await incomeService.GetIncomeSummaryAsync(dateFilter);

            return Request.CreateResponse(HttpStatusCode.OK, 
                new {
                    IncomeSummary = incomeSummary,
                    TotalIncome = incomeSummary.Sum(x => x.Total)
                }
            );
        }

        [Route("add")]
        [HttpPost]
        public async Task<HttpResponseMessage> InsertIncomeAsync(IncomeDTO model)
        {
            await incomeService.InsertIncomeAsync(model);
            return Request.CreateResponse(HttpStatusCode.OK, true);
        }

        [Route("chart")]
        [HttpPost]
        public async Task<HttpResponseMessage> IncomesByCategoryChart(MonthComparisonChartRequestDTO request)
        {
            var isSecondCat = request.SecondCatId.HasValue && request.SecondCatId != 0 ? true : false;
            var catId = isSecondCat ? request.SecondCatId.Value : request.CatId;

            var results = new List<MonthComparisonChartVM[]>()
            {
                (await incomeService.GetIncomesByCategoryAndMonthAsync(request.DateFilter, catId, isSecondCat)).ToArray()
            };

            if (!results[0].Any())
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "No results");
            }
      
            string secondCategory = string.IsNullOrEmpty(results[0].First().SecondCategory) ? "" : $"- ({results[0].First().SecondCategory})";

            var summary = new List<ChartSummaryVM>()
            {
                new ChartSummaryVM
                {
                    AveragedDaily = Utils.ChartsHeaderTitle(results[0], ChartHeaderTitleType.Daily),
                    AveragedMonthly = Utils.ChartsHeaderTitle(results[0], ChartHeaderTitleType.Monthly),
                    TotalSpent = Utils.ChartsHeaderTitle(results[0], ChartHeaderTitleType.Total)
                }
           };

            return Request.CreateResponse(HttpStatusCode.OK,
                new ChartVM
                {
                    Summary = summary,
                    Title = string.Format("{0} Chart for {1} {2}", "Incomes", results[0].First().Category, secondCategory),
                    Data = results
                });
        }
    }
}
