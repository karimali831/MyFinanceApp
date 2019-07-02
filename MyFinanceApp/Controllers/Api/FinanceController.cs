using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace MyFinanceApp.Controllers.Api
{
    public class FinanceController : ApiController
    {
        [Route("auth")]
        [HttpGet]
        public async Task<HttpResponseMessage> Authenticate()
        {
            var info = await navigatorAuthenticationInfoService.IsAuthenticated(Request.GetClientIp(), Request.GetLexBrowsingCookie(), Request.IsSearchEngineBot());

            return Request.CreateResponse(HttpStatusCode.OK, new { Info = info });
        }
    }
}
