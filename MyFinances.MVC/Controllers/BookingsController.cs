using Ninject;
using MyFinances.DTOs;
using MyFinances.Service;
using MyFinances.Website.ViewModels.Finances;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace MyFinances.Controllers
{
    public class FinancesController : Controller
    {
        private readonly IFinanceservice Financeservice;

        public FinancesController(IFinanceservice Financeservice)
        {
            this.Financeservice = Financeservice ?? throw new ArgumentNullException(nameof(Financeservice));
        }

        public async Task<ActionResult> Index()
        {
            var Finances = await Financeservice.GetAllAsync();
            return View(Finances);
        }
    }
}