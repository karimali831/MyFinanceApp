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
            var finances = await financeService.GetAllAsync(resyncNextDueDates);

            var currentMonth = Enum.TryParse(DateTime.UtcNow.Date.ToString("MMMM"), out DateFrequency thisMonth);
            var spentThisMonth = await spendingService.GetSpendingSummary(thisMonth, 1);

            var lastMonth = Enum.TryParse(DateTime.UtcNow.Date.AddMonths(-1).ToString("MMMM"), out DateFrequency previousMonth);
            var spentLastMonth = await spendingService.GetSpendingSummary(previousMonth, 1);

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
                        EndDate = x.EndDate.HasValue ? x.EndDate.Value.ToString("dd-MM-yy") : null,
                        x.Remaining,
                        x.MonthlyDueDate,
                        x.OverrideNextDueDate,
                        x.ManualPayment,
                        NextDueDate = x.NextDueDate.HasValue ? x.NextDueDate.Value.ToLongDateString() : null,
                        DaysUntilDue = financeService.CalculateDays(x.NextDueDate, DateTime.UtcNow),
                        PaymentStatus = financeService.PaymentStatusAsync(x.Id, x.NextDueDate)
                    })
                    .OrderByDescending(x => x.PaymentStatus)
                    .ThenByDescending(x => (x.PaymentStatus == PaymentStatus.Late ? x.DaysUntilDue : null))
                    .ThenBy(x => (x.PaymentStatus == PaymentStatus.Upcoming ? x.DaysUntilDue : null))
                    .ThenBy(x => x.Name),
                TotalAvgCost = finances
                    .Where(x => x.EndDate == null || DateTime.UtcNow.Date < x.EndDate)
                    .Sum(x => x.AvgMonthlyAmount),
                SpentThisMonth = spentThisMonth.Where(x => x.IsFinance == true).Sum(x => x.TotalSpent),
                SpentLastMonth = spentLastMonth.Where(x => x.IsFinance == true).Sum(x => x.TotalSpent)
            });
        }

        [Route("incomes/{sourceId?}/{frequency?}/{interval?}")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetIncomesAsync(int? sourceId = null, DateFrequency? frequency = null, int? interval = null)
        {
            var incomes = await financeService.GetAllIncomesAsync(sourceId, frequency, interval);

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

        [Route("summary/income/{frequency}/{interval}")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetIncomesSummaryAsync(DateFrequency frequency, int interval)
        {
            var incomeSummary = await financeService.GetIncomeSummaryAsync(frequency, interval);

            return Request.CreateResponse(HttpStatusCode.OK, 
                new {
                    IncomeSummary = incomeSummary,
                    TotalIncome = incomeSummary.Sum(x => x.TotalIncome)
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
