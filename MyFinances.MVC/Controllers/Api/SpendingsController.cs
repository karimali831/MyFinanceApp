using MyFinances.DTOs;
using MyFinances.Enums;
using MyFinances.Helpers;
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

        [HttpGet]
        [Route("{catId?}/{frequency?}/{interval?}/{isFinance?}")]
        public async Task<HttpResponseMessage> GetSpendingsAsync(int? catId = null, DateFrequency? frequency = null, int? interval = null, bool isFinance = false)
        {
            var spendings = await spendingService.GetAllAsync(catId, frequency, interval, isFinance);

            return Request.CreateResponse(HttpStatusCode.OK, new {
                Spendings = spendings.Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.Amount,
                    Date = x.Date.ToString("dd-MM-yy"),
                    x.Info,
                    x.Category,
                    x.SecondCategory
                })
            });
        }

        [Route("summary/{frequency}/{interval}")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetSpendingSummaryAsync(DateFrequency frequency, int interval)
        {
            var spendings = await spendingService.GetSpendingSummary(frequency, interval);
            decimal fuelIn = await cnwService.GetFuelIn(frequency, interval);

            return Request.CreateResponse(HttpStatusCode.OK,
                new {
                    SpendingSummary = spendings,
                    TotalSpent = spendings.Sum(x => x.TotalSpent),
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
    }
}
