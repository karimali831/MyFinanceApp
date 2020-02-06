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
    [RoutePrefix("api/reminders")]
    [EnableCors(origins: "http://localhost:3000", headers: "*", methods: "*")]
    [CamelCaseControllerConfig]
    public class RemindersCommonController : ApiController
    {
        private readonly IRemindersService remindersService;

        public RemindersCommonController(IRemindersService remindersService)
        {
            this.remindersService = remindersService ?? throw new ArgumentNullException(nameof(remindersService));
        }

        [HttpGet]
        [Route("")]
        public async Task<HttpResponseMessage> GetRemindersAsync()
        {
            var reminders = await remindersService.GetAllAsync();
            return Request.CreateResponse(HttpStatusCode.OK, new { Reminders = reminders });
        }

        [Route("add")]
        [HttpPost]
        public async Task<HttpResponseMessage> AddReminderAsync(ReminderDTO dto)
        {
            await remindersService.AddReminder(dto);
            return Request.CreateResponse(HttpStatusCode.OK, true);
        }

        [Route("hide/{id}")]
        [HttpPost]
        public async Task<HttpResponseMessage> HideReminderAsync(int id)
        {
            await remindersService.HideReminder(id);
            return Request.CreateResponse(HttpStatusCode.OK, true);
        }
    }
}
