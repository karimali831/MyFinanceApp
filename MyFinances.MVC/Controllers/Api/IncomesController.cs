using MyFinances.DTOs;
using MyFinances.Service;
using MyFinances.Website.Controllers.Api;
using System;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
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
            var incomeExpenseSummary = await incomeService.GetIncomesByCategoryAndMonthAsync(request.Filter, request.CatId, request.IsSecondCat);
            return Request.CreateResponse(HttpStatusCode.OK, incomeExpenseSummary);
        }
    }
}
