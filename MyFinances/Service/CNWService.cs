using MyFinances.DTOs;
using MyFinances.Enums;
using MyFinances.Helpers;
using MyFinances.Model;
using MyFinances.Repository;
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
        Task SyncWeekPeriodAsync(DateTime weekStart);
        Task<CNWPayment> GetWeekSummaryAsync(DateTime weekStart);
        Task<IEnumerable<CNWPayment>> GetWeekSummariesAsync();
        Task<decimal> GetFuelIn(DateFrequency frequency, int interval);
    }

    public class CNWService : ICNWService
    {
        private readonly ICNWRoutesRepository cnwRoutesRepository;
        private readonly ICNWPaymentsRepository cnwPaymentsRepository;
        private readonly ICNWRatesRepository cnwRatesRepository;

        public CNWService(
            ICNWRoutesRepository cnwRoutesRepository, 
            ICNWPaymentsRepository cnwPaymentsRepository,
            ICNWRatesRepository cnwRatesRepository)
        {
            this.cnwRoutesRepository = cnwRoutesRepository ?? throw new ArgumentNullException(nameof(cnwRoutesRepository));
            this.cnwPaymentsRepository = cnwPaymentsRepository ?? throw new ArgumentNullException(nameof(cnwPaymentsRepository));
            this.cnwRatesRepository = cnwRatesRepository ?? throw new ArgumentNullException(nameof(cnwRatesRepository));
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

            var weekPeriod = routes
                .Select(x => new { x.Id, x.RouteDate })
                .Where(x => x.RouteDate.DayOfWeek == DayOfWeek.Sunday);

            foreach (var route in routes)
            {
                var isWeekStartPeriod =  weekPeriod.Select(w => w.Id).Contains(route.Id);

                if (isWeekStartPeriod)
                {
                    var weekPeriodSummaryExists = await cnwPaymentsRepository.WeekPaymentSummaryExists(route.RouteDate);

                    if (weekPeriodSummaryExists)
                    {
                        route.WeekstartPeriod = WeekPeriodSync.Synced;
                    }
                    else if (DateTime.UtcNow.Date <= route.RouteDate.AddDays(6))
                    {
                        route.WeekstartPeriod = WeekPeriodSync.NotSyncedWait;
                    }
                    else
                    {
                        route.WeekstartPeriod = WeekPeriodSync.NotSynced;
                    }

                }
                else
                {
                    route.WeekstartPeriod = WeekPeriodSync.NotWeekstartPeriod;
                }
            }

            return routes;
        }

        public async Task<CNWPayment> GetWeekSummaryAsync(DateTime weekStart)
        {
            var weekSummary = await cnwPaymentsRepository.GetAsync(weekStart);
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
                decimal totalMiles = weekSummary.CalcMiles + (weekSummary.CalcSupportMiles.HasValue ? weekSummary.CalcSupportMiles.Value : 0);
                weekSummary.EstimatedFuelCost = ((double)totalMiles / (double)weekSummary.AverageMpg) * 1.30 * 4.5460900000046;
            }

            return weekSummary;
        }

        public async Task<IEnumerable<CNWPayment>> GetWeekSummariesAsync()
        {
            return (await cnwPaymentsRepository.GetAllAsync()).OrderByDescending(x => x.WeekDate);
        }


        public async Task SyncWeekPeriodAsync(DateTime weekStart)
        {
            if (weekStart.DayOfWeek != DayOfWeek.Sunday)
            {
                throw new ApplicationException("The date selected must be the start of the week i.e. Sunday.");
            }

            var endOfWeek = weekStart.Date.AddDays(6);

            if (DateTime.UtcNow.Date <= endOfWeek)
            {
                throw new ApplicationException("You can only sync at the end of the week");
            }

            // if exists, re-sync by deleting
            if (await cnwPaymentsRepository.WeekPaymentSummaryExists(weekStart))
            {
                await cnwPaymentsRepository.DeleteAsync(weekStart);
            }

            var rates = await cnwRatesRepository.GetAsync();
            var routes = (await GetAllRoutesAsync()).Where(x => x.RouteDate.Date >= weekStart && x.RouteDate.Date <= endOfWeek);

            if (routes != null && routes.Any())
            {
                var fullRoutePay = rates.FullRoute * routes.Count(x => x.RouteTypeId == Categories.Full);
                var halfRoutePay = rates.HalfRoute * routes.Count(x => x.RouteTypeId == Categories.Half);
                var missortRoutePay = rates.MissortRoute * routes.Count(x => x.RouteTypeId == Categories.Missort);
                var supportDrops = routes.Sum(x => x.ExtraDrops) ?? 0;

                var model = new CNWPaymentDTO
                {
                    Routes = routes.Count(),
                    CalcMiles = routes.Sum(x => x.Mileage) ?? 0,
                    CalcSupportMiles = routes.Sum(x => x.ExtraMileage) ?? 0,
                    CalcSupportDrops = supportDrops,
                    CalcRoutePay = fullRoutePay + halfRoutePay + missortRoutePay,
                    AverageMpg = routes.Average(x => x.Mpg) ?? 0,
                    WeekDate = weekStart
                };

                model.CalcMileagePay = rates.Mileage * (model.CalcMiles + model.CalcSupportMiles);
                model.CalcSupportMileagePay = rates.Mileage * model.CalcSupportMiles;
                model.CalcTotalPay = model.CalcRoutePay + model.CalcMileagePay;
                model.CalcSupportPay = supportDrops + model.CalcSupportMileagePay;

                await cnwPaymentsRepository.InsertAsync(model);
            }
        }

        public async Task InsertRouteAsync(CNWRouteDTO dto)
        {
            await cnwRoutesRepository.InsertAsync(dto);

            // auto sync if adding route on last day of the week
            if (dto.RouteDate.DayOfWeek == DayOfWeek.Saturday)
            {
                var firstWorkingDateOfWeek = dto.RouteDate.AddDays(-6);
                await SyncWeekPeriodAsync(firstWorkingDateOfWeek);
            }
        }

        public async Task<decimal> GetFuelIn(DateFrequency frequency, int interval)
        {
            var rates = await cnwRatesRepository.GetAsync();

            return (await cnwPaymentsRepository.GetAllAsync(frequency, interval))
                .Sum(x => rates.Mileage * x.ActualMiles) ?? 0;
        }
    }
}
