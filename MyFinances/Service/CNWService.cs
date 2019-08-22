using MyFinances.DTOs;
using MyFinances.Enums;
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
        Task<IEnumerable<CNWRoute>> GetAllRoutesAsync();
        Task InsertRouteAsync(CNWRouteDTO dto);
        Task SyncWeekPeriodAsync(DateTime weekStart);
        Task<CNWPayment> GetWeekSummaryAsync(DateTime weekStart);
        Task<IEnumerable<CNWPayment>> GetWeekSummariesAsync();
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

        public async Task<IEnumerable<CNWRoute>> GetAllRoutesAsync()
        {
            var routes = await cnwRoutesRepository.GetAllAsync();

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
            }

            return weekSummary;
        }

        public async Task<IEnumerable<CNWPayment>> GetWeekSummariesAsync()
        {
            return await cnwPaymentsRepository.GetAllAsync();
        }


        public async Task SyncWeekPeriodAsync(DateTime weekStart)
        {
            if (weekStart.DayOfWeek != DayOfWeek.Sunday)
            {
                throw new ApplicationException("The date selected must be the start of the week i.e. Sunday.");
            }

            var endOfWeek = weekStart.AddDays(6);

            if (DateTime.UtcNow <= endOfWeek)
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
                var model = new CNWPaymentDTO
                {
                    Routes = routes.Count(),
                    CalcMiles = routes.Sum(x => x.Mileage) ?? 0,
                    CalcRoutePay =
                        rates.FullRoute * routes.Count(x => x.RouteTypeId == Categories.Full) +
                        rates.HalfRoute * routes.Count(x => x.RouteTypeId == Categories.Half) +
                        rates.MissortRoute * routes.Count(x => x.RouteTypeId == Categories.Missort),
                    AverageMpg = routes.Average(x => x.Mpg) ?? 0,
                    WeekDate = weekStart
                };

                decimal deductions = rates.VanRental + rates.AdminFee;
                model.CalcMileagePay = rates.Mileage * model.CalcMiles;
                model.CalcTotalPay = (model.CalcRoutePay + model.CalcMileagePay) - deductions;

                await cnwPaymentsRepository.InsertAsync(model);
            }
        }

        public async Task InsertRouteAsync(CNWRouteDTO dto)
        {
            await cnwRoutesRepository.InsertAsync(dto);
        }
    }
}
