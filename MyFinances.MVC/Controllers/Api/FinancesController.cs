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
            var finances = await financeService.GetFinances(resyncNextDueDates);

            var currentMonth = Enum.TryParse(DateTime.UtcNow.Date.ToString("MMMM"), out DateFrequency thisMonth);
            var spentThisMonth = await spendingService.GetSpendingSummary(new DateFilter { Frequency = thisMonth, Interval = 1 });

            var lastMonth = Enum.TryParse(DateTime.UtcNow.Date.AddMonths(-1).ToString("MMMM"), out DateFrequency previousMonth);
            var spentLastMonth = await spendingService.GetSpendingSummary(new DateFilter { Frequency = previousMonth, Interval = 1 });

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
                    }),
                TotalAvgCost = finances
                    .Where(x => x.EndDate == null || DateTime.UtcNow.Date < x.EndDate)
                    .Sum(x => x.AvgMonthlyAmount),
                SpentThisMonth = spentThisMonth.Where(x => x.IsFinance == true).Sum(x => x.Total),
                SpentLastMonth = spentLastMonth.Where(x => x.IsFinance == true).Sum(x => x.Total)
            });
        }

        [Route("notifications")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetNotificationsAsync()
        {
            var notifications = await financeService.GetNotifications();

            return Request.CreateResponse(HttpStatusCode.OK, new
            {
                Notifications = new
                {
                    LatePaymentsCount = notifications.LatePayments.Count,
                    LatePaymentsTotal = notifications.LatePayments.Total,
                    UpcomingPaymentsCount = notifications.UpcomingPayments.Count,
                    UpcomingPaymentsTotal = notifications.UpcomingPayments.Total,
                    DueTodayPaymentsCount = notifications.DueTodayPayments.Count,
                    DueTodayPaymentsTotal = notifications.DueTodayPayments.Total,
                    UpcomingReminders = notifications.UpcomingReminders.Select(x => new
                    {
                        x.Id,
                        x.Notes,
                        DueDate = x.DueDate.ToString("d/MM/yyyy HH:mm:ss")
                    }),
                    DueTodayReminders = notifications.DueTodayReminders.Select(x => new
                    {
                        x.Id,
                        x.Notes,
                        DueDate = x.DueDate.ToString("d/MM/yyyy HH:mm:ss")
                    })
                }
            });
        }

        [Route("incomes")]
        [HttpPost]
        public async Task<HttpResponseMessage> GetIncomesAsync(IncomeRequestDTO request)
        {
            var incomes = await financeService.GetAllIncomesAsync(request);

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

        [Route("summary/income")]
        [HttpPost]
        public async Task<HttpResponseMessage> GetIncomesSummaryAsync(DateFilter dateFilter)
        {
            if (DateTime.TryParseExact(dateFilter.FromDateRange.ToString(), "dd-MM-yy", new CultureInfo("en-GB"), DateTimeStyles.None, out DateTime fromDateRange))
            {
                dateFilter.FromDateRange = fromDateRange;
            }

            if (DateTime.TryParseExact(dateFilter.ToDateRange.ToString(), "dd-MM-yy", new CultureInfo("en-GB"), DateTimeStyles.None, out DateTime toDateRange))
            {
                dateFilter.ToDateRange = toDateRange;
            }

            var incomeSummary = await financeService.GetIncomeSummaryAsync(dateFilter);

            return Request.CreateResponse(HttpStatusCode.OK, 
                new {
                    IncomeSummary = incomeSummary,
                    TotalIncome = incomeSummary.Sum(x => x.Total)
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
