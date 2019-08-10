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
                    x.Category,
                    x.SecondCategory
                }).OrderByDescending(x => x.Date).ThenBy(x => x.Name).ThenBy(x => x.Category)
            });
        }

        [Route("summary/{daysPeriod}")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetSpendingSummaryAsync(int daysPeriod)
        {
            var spendings = await spendingService.GetAllAsync();

            decimal totalSpent = spendingService.GetTotalSpent(spendings, daysPeriod);
            decimal totalFuelCost = spendingService.GetTotalSpent(spendings, daysPeriod, Categories.Fuel);
            decimal totalVanFuelCost = spendingService.GetTotalSpent(spendings, daysPeriod, Categories.Fuel, Categories.Van);
            decimal totalGTIFuelCost = spendingService.GetTotalSpent(spendings, daysPeriod, Categories.Fuel, Categories.GTI);
            decimal totalRCZFuelCost = spendingService.GetTotalSpent(spendings, daysPeriod, Categories.Fuel, Categories.RCZ);
            decimal totalFoodCost = spendingService.GetTotalSpent(spendings, daysPeriod, Categories.FoodAndDrinks);

            var totalFuelCostByType = new decimal[3];
            totalFuelCostByType[0] = totalVanFuelCost;
            totalFuelCostByType[1] = totalGTIFuelCost;
            totalFuelCostByType[2] = totalRCZFuelCost;


            return Request.CreateResponse(HttpStatusCode.OK, 
                new {
                    SpendingSummary = new SpendingSummaryDTO
                    {
                        TotalSpent = totalSpent,
                        TotalFuelCost = totalFuelCost,
                        TotalFuelCostByType = totalFuelCostByType,
                        TotalFoodCost = totalFoodCost
                    }
                }
            );
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
