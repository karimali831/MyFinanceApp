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
            Bind<IFinanceService>().To<FinanceService>();
            Bind<ISpendingService>().To<SpendingService>();
            Bind<IBaseService>().To<BaseService>();
            Bind<ICNWService>().To<CNWService>();

            // Repositories
            Bind<IFinanceRepository>().To<FinanceRepository>();
            Bind<ISpendingRepository>().To<SpendingRepository>();
            Bind<ICategoryRepository>().To<CategoryRepository>();
            Bind<IBaseRepository>().To<BaseRepository>();
            Bind<ICNWRoutesRepository>().To<CNWRoutesRepository>();
            Bind<IIncomeRepository>().To<IncomeRepository>();
            Bind<ICNWPaymentsRepository>().To<CNWPaymentsRepository>();
            Bind<ICNWRatesRepository>().To<CNWRatesRepository>();
        }
    }
}