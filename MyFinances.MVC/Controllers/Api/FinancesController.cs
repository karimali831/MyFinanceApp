using MyFinances.DTOs;
using MyFinances.Model;
using MyFinances.Service;
using Newtonsoft.Json.Serialization;
using System;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Cors;

namespace MyFinances.Website.Controllers.API
{
    public static class StringExtensions
    {
        public static string FirstCharToUpper(this string input)
        {
            switch (input)
            {
                case null: throw new ArgumentNullException(nameof(input));
                case "": throw new ArgumentException($"{nameof(input)} cannot be empty", nameof(input));
                default: return input.First().ToString().ToUpper() + input.Substring(1);
            }
        }
    }

    public class CamelCaseControllerConfigAttribute : Attribute, IControllerConfiguration
    {
        public void Initialize(HttpControllerSettings controllerSettings, HttpControllerDescriptor controllerDescriptor)
        {
            var formatter = controllerSettings.Formatters.OfType<JsonMediaTypeFormatter>().Single();
            controllerSettings.Formatters.Remove(formatter);

            formatter = new JsonMediaTypeFormatter
            {
                SerializerSettings = { ContractResolver = new CamelCasePropertyNamesContractResolver() }
            };

            controllerSettings.Formatters.Add(formatter);
        }
    }

    [RoutePrefix("api/finances")]
    [EnableCors(origins: "http://localhost:3000", headers: "*", methods: "*")]
    [CamelCaseControllerConfig]
    public class FinancesController : ApiController
    {
        private readonly IFinanceService financeService;

        public FinancesController(
            IFinanceService financeService)
        {
            this.financeService = financeService ?? throw new ArgumentNullException(nameof(financeService));
        }

        [Route("all")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetFinancesAsync()
        {
            var finances = await financeService.GetAllAsync();

            return Request.CreateResponse(HttpStatusCode.OK, new {
                Finances =
                    finances.Select(x => new
                    {
                        x.Id,
                        x.Name,
                        x.AvgMonthlyCost,
                        x.Type,
                        EndDate = x.EndDate.HasValue ? x.EndDate.Value.ToString("dd-MM-yy") : null,
                        x.Remaining
                    })
                    .OrderBy(x => x.Name)
                    .ThenBy(x => x.Type),
                TotalAvgCost = finances.Sum(x => x.AvgMonthlyCost)
            });
        }

        [Route("add")]
        [HttpPost]
        public async Task<HttpResponseMessage> InsertAsync(FinanceDTO finance)
        {
            await financeService.InsertAsync(finance);
            return Request.CreateResponse(HttpStatusCode.OK, true);
        }

        [Route("update/{field}/{id}/{value?}/")]
        [HttpPost]
        public async Task<HttpResponseMessage> UpdateAsync(string field, int id, string value = "")
        {
            string fieldToPascal = StringExtensions.FirstCharToUpper(field);

            object dbValue = value;
            if (DateTime.TryParseExact(value, "dd-MM-yy", new CultureInfo("en-GB"), DateTimeStyles.None, out DateTime date)) {
                dbValue = date;
            }

            await financeService.UpdateAsync(fieldToPascal, dbValue, id);
            return Request.CreateResponse(HttpStatusCode.OK, true);
        }

        [Route("delete/{id}")]
        [HttpPost]
        public async Task<HttpResponseMessage> DeleteAsync(int id)
        {
            await financeService.DeleteAsync(id);
            return Request.CreateResponse(HttpStatusCode.OK, true);
        }
    }
}
