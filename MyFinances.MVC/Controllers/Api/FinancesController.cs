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

        [Route("{resyncNextDueDates}/{upcomingPayments}")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetFinancesAsync(bool resyncNextDueDates, bool upcomingPayments)
        {
            var finances = await financeService.GetAllAsync(resyncNextDueDates);

            if (upcomingPayments)
            {
                finances = finances.Where(x => (x.NextDueDate <= DateTime.UtcNow.AddDays(7) && x.NextDueDate >= DateTime.UtcNow) || x.ManualPayment);
            }

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
                        x.ManualPayment,
                        NextDueDate = x.NextDueDate.HasValue ? x.NextDueDate.Value.ToLongDateString() : null,
                        DaysUntilDue = financeService.CalculateDays(x.NextDueDate, DateTime.UtcNow),
                        DaysLate = financeService.DaysLastPaid(x.Id, true),
                        PaymentStatus = financeService.PaymentStatusAsync(x.Id, x.NextDueDate)
                    })
                    .OrderByDescending(x => x.PaymentStatus)
                    .ThenByDescending(x => (x.PaymentStatus == PaymentStatus.Late ? x.DaysLate : null))
                    .ThenBy(x => (x.PaymentStatus == PaymentStatus.Upcoming ? x.DaysUntilDue : null))
                    .ThenBy(x => x.Name),
                TotalAvgCost = finances
                    .Where(x => x.EndDate == null || DateTime.UtcNow < x.EndDate)
                    .Sum(x => x.AvgMonthlyAmount)
            });
        }

        [Route("incomes")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetIncomesAsync()
        {
            var incomes = await financeService.GetAllIncomesAsync();
            return Request.CreateResponse(HttpStatusCode.OK, new {
                Incomes = 
                    incomes.Select(x => new
                    {
                        x.Id,
                        x.Source,
                        x.SecondSource,
                        Date = x.Date.ToString("dd-MM-yy"),
                        x.Amount
                    })
            });
        }

        [Route("summary/income/{monthsPeriod}")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetIncomesSummaryAsync(int monthsPeriod)
        {
            var incomes = await financeService.GetAllIncomesAsync();
            var totalIncome = financeService.GetTotalIncome(incomes, monthsPeriod);
            var totalIncomeSB = financeService.GetTotalIncome(incomes, monthsPeriod, Categories.SB);
            var totalIncomeCWTL = financeService.GetTotalIncome(incomes, monthsPeriod, Categories.CWTL);
            var totalIncomeUber = financeService.GetTotalIncome(incomes, monthsPeriod, Categories.UberEats);

            return Request.CreateResponse(HttpStatusCode.OK, 
                new
                {
                    IncomeSummary = new IncomeSummaryDTO
                    {
                        TotalIncome = totalIncome,
                        IncomeSB = totalIncomeSB,
                        IncomeCWTL = totalIncomeCWTL,
                        IncomeUberEats = totalIncomeUber
                    }
                }
            );
        }

        [Route("add")]
        [HttpPost]
        public async Task<HttpResponseMessage> InsertAsync(FinanceDTO model)
        {
            await financeService.InsertAsync(model);
            return Request.CreateResponse(HttpStatusCode.OK, true);
        }

        [Route("add/income")]
        [HttpPost]
        public async Task<HttpResponseMessage> InsertIncomeAsync(IncomeDTO model)
        {
            await financeService.InsertIncomeAsync(model);
            return Request.CreateResponse(HttpStatusCode.OK, true);
        }
    }
}
