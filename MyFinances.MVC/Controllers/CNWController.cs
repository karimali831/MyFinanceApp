
using MyFinances.Service;
using MyFinances.Website.ViewModels;
using System;
using System.Globalization;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace MyFinances.Controllers
{
    public class CNWController : Controller
    {
        private readonly ICNWService cnwService;

        public CNWController(ICNWService cnwService)
        {
            this.cnwService = cnwService ?? throw new ArgumentNullException(nameof(cnwService));
        }

        [HttpGet]
        public async Task<ActionResult> WeekSummary(string Id)
        {
            if (DateTime.TryParseExact(Id, "dd-MM-yy", new CultureInfo("en-GB"), DateTimeStyles.None, out DateTime date))
            {
                var weekSummary = await cnwService.GetWeekSummaryAsync(date);
                var routes = await cnwService.GetAllRoutesAsync(weekSummary.WeekNo);

                return View(
                    new WeekSummaryVM {
                        Payment = weekSummary,
                        Routes = routes
                    }
                );
            }

            return new EmptyResult();
        }

        [HttpGet]
        public async Task<ActionResult> RouteSummary(int Id)
        {
            var routeSummary = await cnwService.GetRouteSummaryAsync(Id);

            if (routeSummary != null)
            {
                return View(routeSummary);
            }

            return new EmptyResult();
        }
    }
}