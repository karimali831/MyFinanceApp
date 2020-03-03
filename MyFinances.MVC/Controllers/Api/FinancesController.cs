﻿using MyFinances.DTOs;
using MyFinances.Enums;
using MyFinances.Helpers;
using MyFinances.Service;
using MyFinances.ViewModels;
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
        private readonly ISpendingService spendingService;

        public FinancesController(IFinanceService financeService, ISpendingService spendingService)
        {
            this.financeService = financeService ?? throw new ArgumentNullException(nameof(financeService));
            this.spendingService = spendingService ?? throw new ArgumentNullException(nameof(spendingService));
        }

        [Route("{resyncNextDueDates}/{upcomingPayments}")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetFinancesAsync(bool resyncNextDueDates, bool upcomingPayments)
        {
            var finances = await financeService.GetFinances(resyncNextDueDates);

            if (upcomingPayments)
            {
                finances = finances.Where(x => x.NextDueDate <= DateTime.UtcNow.Date.AddDays(7) || x.ManualPayment);
            }

            return Request.CreateResponse(HttpStatusCode.OK, new {
                Finances =
                    finances.Select(x => new
                    {
                        x.Id,
                        x.Name,
                        x.AvgMonthlyAmount,
                        x.Remaining,
                        x.MonthlyDueDate,
                        x.OverrideNextDueDate,
                        x.ManualPayment,
                        x.DaysUntilDue,
                        x.PaymentStatus,
                        EndDate = x.EndDate.HasValue ? x.EndDate.Value.ToString("dd-MM-yy") : null,
                        NextDueDate = x.NextDueDate.HasValue ? x.NextDueDate.Value.ToLongDateString() : null
                    })
            });
        }

        [Route("add")]
        [HttpPost]
        public async Task<HttpResponseMessage> InsertAsync(FinanceDTO model)
        {
            await financeService.InsertAsync(model);
            return Request.CreateResponse(HttpStatusCode.OK, true);
        }

        [Route("chart/incomeexpense")]
        [HttpPost]
        public async Task<HttpResponseMessage> IncomeExpenseComparisonChart(MonthComparisonChartRequestDTO request)
        {
            var results = await financeService.GetIncomeExpenseTotalsByMonth(request.DateFilter);

            return Request.CreateResponse(HttpStatusCode.OK,
                new ChartVM
                {
                    Data = results
                });
        }

        [Route("chart")]
        [HttpPost]
        public async Task<HttpResponseMessage> FinancesChartAsync(MonthComparisonChartRequestDTO request)
        {
            return Request.CreateResponse(HttpStatusCode.OK, new ChartVM
            {
                Data = await financeService.GetFinanceTotalsByMonth(request)
            });
        }
    }
}
