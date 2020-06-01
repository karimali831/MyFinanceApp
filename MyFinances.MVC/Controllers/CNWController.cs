
using MyFinances.Service;
using MyFinances.Website.ViewModels;
using System;
using System.Globalization;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace MyFinances.Controllers
{
    public class CNWController : UserMvcController
    {
        private readonly ICNWService cnwService;

        public CNWController(ICNWService cnwService)
        {
            this.cnwService = cnwService ?? throw new ArgumentNullException(nameof(cnwService));
        }

        [HttpGet]
        public async Task<ActionResult> WeekSummary(int Id)
        {
            var weekSummary = await cnwService.GetWeekSummaryAsync(Id);
            var routes = await cnwService.GetAllRoutesAsync(Id);

            return View(
                new WeekSummaryVM
                {
                    Payment = weekSummary,
                    Routes = routes
                }
            );
        }

        [HttpGet]
        public async Task<ActionResult> RouteSummary(int Id)
        {
            var routeSummary = await cnwService.GetRouteSummaryAsync(Id);

            if (routeSummary != null)
            {
                decimal totalMiles = routeSummary.Mileage + (routeSummary.ExtraMileage ?? 0);
                routeSummary.EstimatedFuelCost = cnwService.EstimatedFuelCost(totalMiles, routeSummary.Mpg, routeSummary.FuelCost);

                return View(routeSummary);
            }

            return new EmptyResult();
        }
    }
}