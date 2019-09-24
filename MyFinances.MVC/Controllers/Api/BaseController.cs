using MyFinances.DTOs;
using MyFinances.Enums;
using MyFinances.Helpers;
using MyFinances.Model;
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
    [RoutePrefix("api")]
    [EnableCors(origins: "http://localhost:3000", headers: "*", methods: "*")]
    [CamelCaseControllerConfig]
    public class BaseCommonController : ApiController
    {
        private readonly IBaseService baseService;

        public BaseCommonController(IBaseService baseService)
        {
            this.baseService = baseService ?? throw new ArgumentNullException(nameof(baseService));
        }

        [Route("categories/{typeId?}/{catsWithSubs}")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetCategoriesAsync(CategoryType? typeId = null, bool catsWithSubs = false)
        {
            var categories = await baseService.GetAllCategories(typeId, catsWithSubs);
            return Request.CreateResponse(HttpStatusCode.OK, new { Categories = categories });
        }

        [Route("categories/add")]
        [HttpPost]
        public async Task<HttpResponseMessage> AddCategoryAsync(CategoryDTO dto)
        {
            await baseService.AddCategory(dto);
            return Request.CreateResponse(HttpStatusCode.OK, true);
        }

        [Route("update/{table}/{field}/{id}/{value?}/")]
        [HttpPost]
        public async Task<HttpResponseMessage> UpdateAsync(string table, string field, int id, string value = "")
        {
            string fieldToPascal = Utils.FirstCharToUpper(field);

            object dbValue = value;
            if (DateTime.TryParseExact(value, "dd-MM-yy", new CultureInfo("en-GB"), DateTimeStyles.None, out DateTime date)) {
                dbValue = date;
            }

            await baseService.UpdateAsync(fieldToPascal, dbValue, id, table);
            return Request.CreateResponse(HttpStatusCode.OK, true);
        }

        [Route("delete/{id}/{table}")]
        [HttpPost]
        public async Task<HttpResponseMessage> DeleteAsync(int id, string table)
        {
            await baseService.DeleteAsync(id, table);
            return Request.CreateResponse(HttpStatusCode.OK, true);
        }
    }
}
