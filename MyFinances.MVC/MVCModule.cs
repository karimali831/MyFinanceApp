﻿using Ninject.Modules;
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
            Bind<IFinanceservice>().To<Financeservice>();

            // Repositories
            Bind<IFinancesRepository>().To<FinancesRepository>();
        }
    }


}