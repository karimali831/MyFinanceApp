using MyFinances.DTOs;
using MyFinances.Enums;
using MyFinances.Helpers;
using MyFinances.Service;
using MyFinances.ViewModels;
using MyFinances.Website.Controllers.Api;
using System;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;

namespace MyFinances.Website.Controllers.API
{
    [RoutePrefix("api/spendings")]
    [EnableCors(origins: "http://localhost:3000", headers: "*", methods: "*")]
    [CamelCaseControllerConfig]
    public class SpendingsController : ApiController
    {
        private readonly ISpendingService spendingService;
        private readonly ICNWService cnwService;

        public SpendingsController(ISpendingService spendingService, ICNWService cnwService)
        {
            this.spendingService = spendingService ?? throw new ArgumentNullException(nameof(spendingService));
            this.cnwService = cnwService ?? throw new ArgumentNullException(nameof(cnwService));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> GetSpendingsAsync(SpendingRequestDTO request)
        {
            var spendings = await spendingService.GetAllAsync(request);

            return Request.CreateResponse(HttpStatusCode.OK, new {
                Spendings = spendings.Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.Amount,
                    Date = x.Date.ToString("MM/dd/yyyy"),
                    x.Info,
                    x.Category,
                    x.SecondCategory
                })
            });
        }

        [Route("summary")]
        [HttpPost]
        public async Task<HttpResponseMessage> GetSpendingSummaryAsync(DateFilter dateFilter)
        {
            if (DateTime.TryParseExact(dateFilter.FromDateRange.ToString(), "dd-MM-yy", new CultureInfo("en-GB"), DateTimeStyles.None, out DateTime fromDateRange))
            {
                dateFilter.FromDateRange = fromDateRange;
            }

            if (DateTime.TryParseExact(dateFilter.ToDateRange.ToString(), "dd-MM-yy", new CultureInfo("en-GB"), DateTimeStyles.None, out DateTime toDateRange))
            {
                dateFilter.ToDateRange = toDateRange;
            }

            var spendings = await spendingService.GetSpendingSummary(dateFilter);

            dateFilter.DateField = "PayDate";
            decimal fuelIn = await cnwService.GetFuelIn(dateFilter);

            return Request.CreateResponse(HttpStatusCode.OK,
                new {
                    SpendingSummary = spendings,
                    TotalSpent = spendings.Sum(x => x.Total),
                    FuelIn = fuelIn
                }
            );
        }

        [Route("add")]
        [HttpPost]
        public async Task<HttpResponseMessage> InsertAsync(SpendingDTO dto)
        {
            // hack for now 
            if (dto.FinanceId == 0)
                dto.FinanceId = null;

            if (dto.CatId == 0)
                dto.CatId = null;

            if (dto.FinanceId.HasValue && dto.CatId.HasValue)
                dto.CatId = null;

            if (!dto.FinanceId.HasValue && !dto.CatId.HasValue)
                return Request.CreateResponse(HttpStatusCode.BadRequest, false);

            await spendingService.InsertAsync(dto);
            return Request.CreateResponse(HttpStatusCode.OK, true);
        }

        [Route("chart")]
        [HttpPost]
        public async Task<HttpResponseMessage> SpendingsByCategoryChart(MonthComparisonChartRequestDTO request)
        {
            var isSecondCat = request.SecondCatId.HasValue && !request.IsFinance && request.SecondCatId != 0 ? true : false;
            var catId = isSecondCat ? request.SecondCatId.Value : request.CatId;

            var results = await spendingService.GetSpendingsByCategoryAndMonthAsync(request.DateFilter, catId, isSecondCat, request.IsFinance);

            if (!results.Any())
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "No results");
            }

            string secondCategory = string.IsNullOrEmpty(results.First().SecondCategory) ? "" : $"- ({results.First().SecondCategory})";

            var summary = new ChartSummaryVM
            {
                AveragedDailyDs1 = Utils.ChartsHeaderTitle(results, ChartHeaderTitleType.Daily),
                AveragedMonthlyDs1 = Utils.ChartsHeaderTitle(results, ChartHeaderTitleType.Monthly),
                TotalSpentDs1 = Utils.ChartsHeaderTitle(results, ChartHeaderTitleType.Total),
            };

            return Request.CreateResponse(HttpStatusCode.OK, 
                new ChartVM
                {
                    Summary = summary,
                    Title = string.Format("{0} Chart for {1} {2}", "Spendings", results.First().Category, secondCategory),
                    Data = results
                });
        }
    }
}
