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
    [RoutePrefix("api/finances")]
    [EnableCors(origins: "http://localhost:3000", headers: "*", methods: "*")]
    [CamelCaseControllerConfig]
    public class FinancesController : ApiController
    {
        private readonly IFinanceService financeService;

        public FinancesController(IFinanceService financeService)
        {
            this.financeService = financeService ?? throw new ArgumentNullException(nameof(financeService));
        }

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
                        x.AvgMonthlyAmount,
                        EndDate = x.EndDate.HasValue ? x.EndDate.Value.ToString("dd-MM-yy") : null,
                        x.Remaining,
                        x.MonthlyDueDate,
                        x.Income,
                        x.ManualPayment
                    })
                    .OrderBy(x => x.Income)
                    .ThenBy(x => x.MonthlyDueDate)
                    .ThenBy(x => x.Name),
                TotalAvgCost = finances
                    .Where(x => x.Income == false && (x.EndDate == null || DateTime.UtcNow < x.EndDate))
                    .Sum(x => x.AvgMonthlyAmount)
            });
        }

        [Route("add/{name}")]
        [HttpPost]
        public async Task<HttpResponseMessage> InsertAsync(string name)
        {
            await financeService.InsertAsync(name);
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
