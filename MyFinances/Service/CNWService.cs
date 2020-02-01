using MyFinances.DTOs;
using MyFinances.Enums;
using MyFinances.Helpers;
using MyFinances.Model;
using MyFinances.Repository;
using MyFinances.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyFinances.Service
{
    public interface ICNWService
    {
        Task<IEnumerable<CNWRoute>> GetAllRoutesAsync(int? weekNo = null);
        Task<CNWRoute> GetRouteSummaryAsync(int Id);
        Task InsertRouteAsync(CNWRouteDTO dto);
        Task SyncWeekPeriodAsync(int weekNo, bool resync = false);
        Task<CNWPayment> GetWeekSummaryAsync(int weekNo);
        Task<IEnumerable<CNWPayment>> GetWeekSummariesAsync();
        Task<decimal> GetFuelIn(DateFilter dateFilter);
        decimal EstimatedFuelCost(decimal miles, decimal averageMpg, decimal fuelCost);
        Task MissedCNWPaymentEntriesAsync();
    }

    public class CNWService : ICNWService
    {
        private readonly ICNWRoutesRepository cnwRoutesRepository;
        private readonly ICNWPaymentsRepository cnwPaymentsRepository;
        private readonly ICNWRatesRepository cnwRatesRepository;
        private readonly IRemindersService remindersService;

        public CNWService(
            ICNWRoutesRepository cnwRoutesRepository, 
            ICNWPaymentsRepository cnwPaymentsRepository,
            ICNWRatesRepository cnwRatesRepository,
            IRemindersService remindersService)
        {
            this.cnwRoutesRepository = cnwRoutesRepository ?? throw new ArgumentNullException(nameof(cnwRoutesRepository));
            this.cnwPaymentsRepository = cnwPaymentsRepository ?? throw new ArgumentNullException(nameof(cnwPaymentsRepository));
            this.cnwRatesRepository = cnwRatesRepository ?? throw new ArgumentNullException(nameof(cnwRatesRepository));
            this.remindersService = remindersService ?? throw new ArgumentNullException(nameof(remindersService));
        }

        public async Task<CNWRoute> GetRouteSummaryAsync(int Id)
        {
            return await cnwRoutesRepository.GetAsync(Id);
        }

        public async Task<IEnumerable<CNWRoute>> GetAllRoutesAsync(int? weekNo = null)
        {
            var routes = (
                await cnwRoutesRepository.GetAllAsync(weekNo))
                .OrderByDescending(x => x.RouteDate);

            if (routes != null && routes.Any())
            {
                var groupRoutesByWeekNo = routes.Select(x => new { x.WeekNo }).GroupBy(x => x.WeekNo);

                foreach (var route in groupRoutesByWeekNo)
                {
                    await SyncWeekPeriodAsync(route.First().WeekNo);
                }
            }

            return routes;
        }

        public async Task<CNWPayment> GetWeekSummaryAsync(int weekNo)
        {
            var weekSummary = await cnwPaymentsRepository.GetAsync(weekNo);
            var rates = await cnwRatesRepository.GetAsync();

            if (weekSummary != null)
            {
                weekSummary.ActualMileagePay = rates.Mileage * weekSummary.ActualMiles;
                weekSummary.CNWRates = rates;
                weekSummary.ActualNetAmount = weekSummary.ActualTotalPay - rates.VATFlatRate;
                weekSummary.CalcTotalPayToDriver = weekSummary.CalcNetAmount + rates.VATFlatRate;

                /*
                 * Estimated fuel cost formula 
                 * 1. Convert Pounds Per Liter (lb/l) to Pounds Per Gallon (imperial) (lb/gal)
                 *    i.e. 1.30 (pence per liter) * 4.5460900000046 = 5.91 
                 * 2. Divide miles by mpg
                 *    i.e. 50 miles / 25 mpg = galloons needed for trip
                 * 3. Multiply that figure by the cost of fuel
                 *    i.e. 50 / 25 = 2 * 5.91
                 */
                decimal totalMiles = weekSummary.CalcMiles + (weekSummary.CalcSupportMiles ?? 0);
                weekSummary.EstimatedFuelCost = EstimatedFuelCost(totalMiles, weekSummary.AverageMpg, weekSummary.AverageFuelCost);
            }

            return weekSummary;
        }

        public decimal EstimatedFuelCost(decimal miles, decimal averageMpg, decimal fuelCost)
        {
            return (miles / averageMpg) * fuelCost * (decimal)4.5460900000046;
        }

        public async Task<IEnumerable<CNWPayment>> GetWeekSummariesAsync()
        {
            return (
                await cnwPaymentsRepository.GetAllAsync(
                    new DateFilter {
                        DateField = "PayDate"
                    }
                )).OrderByDescending(x => x.WeekDate);
        }


        public async Task SyncWeekPeriodAsync(int weekNo, bool resync = false)
        {
            // here we want to sync week period if it does not exist and if we have already started the next weeks route.
            var weekPaymentSummaryExists = await cnwPaymentsRepository.WeekPaymentSummaryExists(weekNo);
            var routes = await cnwRoutesRepository.GetAllAsync(weekNo);
            var nextWeekRoutes = await cnwRoutesRepository.GetAllAsync(weekNo + 1);

            // if re-syncing then delete
            if (weekPaymentSummaryExists && resync)
            {
                await cnwPaymentsRepository.DeleteAsync(weekNo);
            }

            if (!weekPaymentSummaryExists && nextWeekRoutes != null && nextWeekRoutes.Any())
            {
                var rates = await cnwRatesRepository.GetAsync();

                if (routes != null && routes.Any())
                {
                    var fullRoutePay = rates.FullRoute * routes.Count(x => x.RouteTypeId == Categories.Full);
                    var halfRoutePay = rates.HalfRoute * routes.Count(x => x.RouteTypeId == Categories.Half);
                    var missortRoutePay = rates.MissortRoute * routes.Count(x => x.RouteTypeId == Categories.Missort);
                    var supportDrops = routes.Sum(x => x.ExtraDrops) ?? 0;
                    var firstWeekDate = routes.OrderBy(x => x.RouteDate).Select(x => x.RouteDate).FirstOrDefault();

                    var model = new CNWPaymentDTO
                    {
                        Routes = routes.Count(),
                        CalcMiles = routes.Sum(x => x.Mileage),
                        CalcSupportMiles = routes.Sum(x => x.ExtraMileage) ?? 0,
                        CalcSupportDrops = supportDrops,
                        CalcRoutePay = fullRoutePay + halfRoutePay + missortRoutePay,
                        AverageMpg = routes.Average(x => x.Mpg),
                        WeekDate = firstWeekDate
                    };

                    model.CalcMileagePay = rates.Mileage * (model.CalcMiles + model.CalcSupportMiles);
                    model.CalcSupportMileagePay = rates.Mileage * model.CalcSupportMiles;
                    model.CalcTotalPay = model.CalcRoutePay + model.CalcMileagePay;
                    model.CalcSupportPay = supportDrops + model.CalcSupportMileagePay;

                    await cnwPaymentsRepository.InsertAsync(model);
                }
            }
        }

        public async Task InsertRouteAsync(CNWRouteDTO dto)
        {
            await cnwRoutesRepository.InsertAsync(dto);
        }

        public async Task<decimal> GetFuelIn(DateFilter dateFilter)
        {
            var rates = await cnwRatesRepository.GetAsync();

            return (await cnwPaymentsRepository.GetAllAsync(dateFilter))
                .Sum(x => rates.Mileage * x.ActualMiles) ?? 0;
        }

        public async Task MissedCNWPaymentEntriesAsync()
        {
            var weekSummaries = (await GetWeekSummariesAsync()).Select(x => x.WeekNo.ToString()).ToList();

            var currentWeek = Utils.GetWeek(DateTime.UtcNow);

            var weeks = new List<string>();

            for (int i = 1; i <= currentWeek; i++)
            {
                weeks.Add(i.ToString());
            }

            var results = weekSummaries.Except(weeks);
            var missedEntries = new List<MissedEntries>();

            var data = new MissedEntries()
            {
                Name = "CNW Week",
                Dates = results.ToArray()
            };

            missedEntries.Add(data);

            await remindersService.MissedEntriesAsync(missedEntries, "You have a missed CNW payment entry for");
        }
    }
}
