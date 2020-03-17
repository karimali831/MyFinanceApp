using Ninject.Modules;
using MyFinances.Repository;
using MyFinances.Service;

namespace MyFinances.Ninject
{
    public class MVCModule : NinjectModule
    {
        public override void Load()
        {
            // Services
            Bind<IFinanceService>().To<FinanceService>().InSingletonScope();
            Bind<ISpendingService>().To<SpendingService>();
            Bind<IBaseService>().To<BaseService>();
            Bind<ICNWService>().To<CNWService>();
            Bind<IRemindersService>().To<RemindersService>();
            Bind<IIncomeService>().To<IncomeService>();

            // Repositories
            Bind<IFinanceRepository>().To<FinanceRepository>();
            Bind<ISpendingRepository>().To<SpendingRepository>();
            Bind<ICategoryRepository>().To<CategoryRepository>();
            Bind<ISettingRepository>().To<SettingRepository>();
            Bind<IBaseRepository>().To<BaseRepository>();
            Bind<ICNWRoutesRepository>().To<CNWRoutesRepository>();
            Bind<IIncomeRepository>().To<IncomeRepository>();
            Bind<ICNWPaymentsRepository>().To<CNWPaymentsRepository>();
            Bind<ICNWRatesRepository>().To<CNWRatesRepository>();
            Bind<IRemindersRepository>().To<RemindersRepository>();
        }
    }
}