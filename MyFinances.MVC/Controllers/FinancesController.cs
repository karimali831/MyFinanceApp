using MyFinances.Controllers;
using MyFinances.DTOs;
using MyFinances.Enums;
using MyFinances.Helpers;
using MyFinances.Model;
using MyFinances.Service;
using MyFinances.ViewModels;
using MyFinances.Website.Models;
using MyFinances.Website.ViewModels;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;

namespace MyFinances.Website.Controllers
{
    public class FinancesController : UserMvcController
    {
        private readonly IBaseService baseService;

        public FinancesController(IBaseService baseService)
        {
            this.baseService = baseService ?? throw new ArgumentNullException(nameof(baseService));
        }

        // GET: Finances
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> Settings(Setting model)
        {
            await baseService.UpdateSettingsAsync(model);
            return RedirectToAction("Settings");
        }

        public async Task<ActionResult> Settings()
        {
            var settings = await baseService.GetSettingsAsync();
            return View(settings);
        }

        public async Task<ActionResult> Categories()
        {
            var spendingCategories = (await baseService.GetAllCategories(CategoryType.Spendings, catsWithSubs: false));
            var incomeCategories = (await baseService.GetAllCategories(CategoryType.IncomeSources, catsWithSubs: false));

            var viewmodel = new CategoriesVM
            {
                SpendingCategories = spendingCategories,
                IncomeCategories = incomeCategories
            };

            var spendingSecondCats = new Dictionary<CategoryType, IEnumerable<Model.Category>>();
            var incomeSecondCats = new Dictionary<CategoryType, IEnumerable<Model.Category>>();

            foreach (var cat in spendingCategories.Where(x => x.SecondTypeId.HasValue && x.SecondTypeId != 0))
            {
                var secondCategories = await baseService.GetAllCategories(cat.SecondTypeId, catsWithSubs: false);
                spendingSecondCats.Add(cat.SecondTypeId.Value, secondCategories);
            }

            foreach (var cat in incomeCategories.Where(x => x.SecondTypeId.HasValue && x.SecondTypeId != 0))
            {
                var secondCategories = await baseService.GetAllCategories(cat.SecondTypeId, catsWithSubs: false);
                incomeSecondCats.Add(cat.SecondTypeId.Value, secondCategories);
            }

            viewmodel.SpendingSecondCategories = spendingSecondCats;
            viewmodel.IncomeSecondCategories = incomeSecondCats;

            return View("Categories", viewmodel);
        }
    }
}