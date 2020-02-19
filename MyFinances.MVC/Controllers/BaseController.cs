
using MyFinances.Service;
using MyFinances.Website.ViewModels;
using System;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace MyFinances.Controllers
{
    public class MultiCultureMvcRouteHandler : MvcRouteHandler
    {

        protected override IHttpHandler GetHttpHandler(RequestContext requestContext)
        {
            // get culture from route data
            var culture = "en-GB";
            var ci = new CultureInfo(culture);
            Thread.CurrentThread.CurrentUICulture = ci;
            Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(ci.Name);
            return base.GetHttpHandler(requestContext);

     
        }


    }
}