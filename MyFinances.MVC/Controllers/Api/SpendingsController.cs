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

        public SpendingsController(ISpendingService spendingService)
        {
            this.spendingService = spendingService ?? throw new ArgumentNullException(nameof(spendingService));
        }

        [HttpGet]
        public async Task<HttpResponseMessage> GetSpendingsAsync()
        {
            var spendings = await spendingService.GetAllAsync();

            return Request.CreateResponse(HttpStatusCode.OK, new {
                Spendings = spendings.Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.Amount,
                    Date = x.Date.ToString("dd-MM-yy"),
                    x.Info,
                    x.Category
                }).OrderByDescending(x => x.Date).ThenBy(x => x.Name).ThenBy(x => x.Category)
            });
        }

        [Route("summary")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetSpendingSummaryAsync()
        {
            var spendings = await spendingService.GetAllAsync();
            var totalSpent = new decimal[3];

            totalSpent[0] = spendingService.GetTotalSpent(spendings, -1);
            totalSpent[1] = spendingService.GetTotalSpent(spendings, -7);
            totalSpent[2] = spendingService.GetTotalSpent(spendings, -30);

            return Request.CreateResponse(HttpStatusCode.OK, new { TotalSpent = totalSpent });
        }

        [Route("add")]
        [HttpPost]
        public async Task<HttpResponseMessage> InsertAsync(SpendingDTO dto)
        {
            await spendingService.InsertAsync(dto);
            return Request.CreateResponse(HttpStatusCode.OK, true);
        }
    }
}
