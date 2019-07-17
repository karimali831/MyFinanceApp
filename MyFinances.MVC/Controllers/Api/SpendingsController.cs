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
            var categories = await spendingService.GetAllCategories();
            var totalSpent = new decimal[3];

            totalSpent[0] = spendingService.GetTotalSpent(spendings, -1);
            totalSpent[1] = spendingService.GetTotalSpent(spendings, -7);
            totalSpent[2] = spendingService.GetTotalSpent(spendings, -30);

            return Request.CreateResponse(HttpStatusCode.OK, new {
                Spendings = spendings.Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.Amount,
                    Date = x.Date.ToString("dd-MM-yy"),
                    x.Info,
                    x.Category
                }).OrderBy(x => x.Name).ThenBy(x => x.Category),
                Categories = categories,
                TotalSpent = totalSpent
            });
        }

        [Route("add/{name}/{catId}/{amount}/")]
        [HttpPost]
        public async Task<HttpResponseMessage> InsertAsync(string name, int catId, decimal amount)
        {
            await spendingService.InsertAsync(name, catId, amount);
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

            await spendingService.UpdateAsync(fieldToPascal, dbValue, id);
            return Request.CreateResponse(HttpStatusCode.OK, true);
        }

        [Route("delete/{id}")]
        [HttpPost]
        public async Task<HttpResponseMessage> DeleteAsync(int id)
        {
            await spendingService.DeleteAsync(id);
            return Request.CreateResponse(HttpStatusCode.OK, true);
        }
    }
}
