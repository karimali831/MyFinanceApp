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
        public async Task<HttpResponseMessage> GetRoutesAsync()
        {
            var routes = await cnwService.GetAllAsync();

            return Request.CreateResponse(HttpStatusCode.OK, new {
                Routes = routes.Select(x => new
                {
                    x.Id,
                    x.RouteNo,
                    x.RouteType,
                    RouteDate = x.RouteDate.ToString("dd-MM-yy"),
                    x.Mileage,
                    x.Mpg,
                    x.Drops,
                    x.ExtraDrops,
                    x.ExtraMileage,
                    x.Info
                }).OrderByDescending(x => x.RouteDate)
            });
        }

        [Route("add")]
        [HttpPost]
        public async Task<HttpResponseMessage> InsertAsync(CNWRouteDTO dto)
        {
            await cnwService.InsertAsync(dto);
            return Request.CreateResponse(HttpStatusCode.OK, true);
        }
    }
}
