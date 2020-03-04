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
    [RoutePrefix("api/cnw")]
    [EnableCors(origins: "http://localhost:3000", headers: "*", methods: "*")]
    [CamelCaseControllerConfig]
    public class CNWController : ApiController
    {
        private readonly ICNWService cnwService;

        public CNWController(ICNWService cnwService)
        {
            this.cnwService = cnwService ?? throw new ArgumentNullException(nameof(cnwService));
        }

        [HttpGet]
        [Route("{weekNo?}")]
        public async Task<HttpResponseMessage> GetRoutesAsync(int? weekNo = null)
        {
            var routes = await cnwService.GetAllRoutesAsync(weekNo);

            return Request.CreateResponse(HttpStatusCode.OK, new {
                Routes = routes.Select(x => new
                {
                    x.Id,
                    x.WeekNo,
                    x.RouteType,
                    RouteDate = x.RouteDate.ToString("MM/dd/yyyy"),
                    x.Mileage,
                    x.Mpg,
                    x.FuelCost,
                    x.ExtraDrops,
                    x.ExtraMileage,
                    x.Info
                })
            });
        }

        [Route("add")]
        [HttpPost]
        public async Task<HttpResponseMessage> InsertAsync(CNWRouteDTO dto)
        {
            await cnwService.InsertRouteAsync(dto);
            return Request.CreateResponse(HttpStatusCode.OK, true);
        }

        [Route("weeksummaries")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetWeekSummaries()
        {
            var weekSummaries = (await cnwService.GetWeekSummariesAsync());
            return Request.CreateResponse(HttpStatusCode.OK, new {
                WeekSummaries = weekSummaries.Select(x => new
                {
                    x.Id,
                    x.WeekNo,
                    PayDate = x.PayDate.ToString("MM/dd/yyyy"),
                    x.ActualMiles,
                    x.ActualRoutePay,
                    x.ActualTotalPay,
                    x.ActualSupportPay,
                    x.Byod,
                    x.DeduVanDamages
                })
            });
        }

        [Route("resyncweek/{weekNo}")]
        [HttpPost]
        public async Task<HttpResponseMessage> ResyncWeek(int weekNo)
        {
            await cnwService.SyncWeekPeriodAsync(weekNo, true);
            return Request.CreateResponse(HttpStatusCode.OK, true);
        }
    }
}
