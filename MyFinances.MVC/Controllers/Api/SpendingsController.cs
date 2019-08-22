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

            decimal totalSpent = await spendingService.GetTotalSpent(spendings, daysPeriod);
            decimal totalFuelCost = await spendingService.GetTotalSpent(spendings, daysPeriod, Categories.Fuel);
            decimal totalVanFuelCost = await spendingService.GetTotalSpent(spendings, daysPeriod, Categories.Fuel, Categories.Van);
            decimal totalGTIFuelCost = await spendingService.GetTotalSpent(spendings, daysPeriod, Categories.Fuel, Categories.GTI);
            decimal totalRCZFuelCost = await spendingService.GetTotalSpent(spendings, daysPeriod, Categories.Fuel, Categories.RCZ);
            decimal totalFoodCost = await spendingService.GetTotalSpent(spendings, daysPeriod, Categories.FoodAndDrinks);
            decimal totalInterestAndFees = await spendingService.GetTotalSpent(spendings, daysPeriod, Categories.InterestAndFees);
            decimal totalODFees = await spendingService.GetTotalSpent(spendings, daysPeriod, Categories.InterestAndFees, Categories.OverdraftFees);
            decimal totalCCFees = await spendingService.GetTotalSpent(spendings, daysPeriod, Categories.InterestAndFees, Categories.CCInterest);
            decimal totalFuelIn = await spendingService.GetFuelIn(daysPeriod);

            var totalFuelCostByType = new decimal[3];
            totalFuelCostByType[0] = totalVanFuelCost;
            totalFuelCostByType[1] = totalGTIFuelCost;
            totalFuelCostByType[2] = totalRCZFuelCost;

            return Request.CreateResponse(HttpStatusCode.OK, 
                new {
                    SpendingSummary = new SpendingSummaryDTO
                    {
                        TotalSpent = totalSpent,
                        FuelCost = totalFuelCost,
                        FuelCostByType = totalFuelCostByType,
                        FuelIn = totalFuelIn,
                        FoodCost = totalFoodCost,
                        InterestAndFees = totalInterestAndFees,
                        OverdraftFees = totalODFees,
                        CreditcardFees = totalCCFees
                    }
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
