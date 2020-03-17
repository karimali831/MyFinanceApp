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
    public class FinancesController : Controller
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
    }
}