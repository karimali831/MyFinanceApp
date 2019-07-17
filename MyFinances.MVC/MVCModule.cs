using Ninject.Modules;
using MyFinances.Repository;
using MyFinances.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyFinances.Ninject
{
    public class MVCModule : NinjectModule
    {
        public override void Load()
        {
            // Services
            Bind<IFinanceService>().To<FinanceService>();
            Bind<ISpendingService>().To<SpendingService>();

            // Repositories
            Bind<IFinanceRepository>().To<FinanceRepository>();
            Bind<ISpendingRepository>().To<SpendingRepository>();
            Bind<ICategoryRepository>().To<CategoryRepository>();
        }
    }


}