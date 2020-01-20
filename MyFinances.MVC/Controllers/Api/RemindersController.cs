﻿using MyFinances.DTOs;
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
    public class RemindersCommonController : ApiController
    {
        private readonly IRemindersService remindersService;

        public RemindersCommonController(IRemindersService remindersService)
        {
            this.remindersService = remindersService ?? throw new ArgumentNullException(nameof(remindersService));
        }


        [Route("reminders/add")]
        [HttpPost]
        public async Task<HttpResponseMessage> AddReminderAsync(ReminderDTO dto)
        {
            await remindersService.AddReminder(dto);
            return Request.CreateResponse(HttpStatusCode.OK, true);
        }
    }
}
