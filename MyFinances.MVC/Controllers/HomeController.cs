using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MyFinances.Controllers
{
    public class HomeController : Controller
    { 
        public string pwd = "542769";

        public ActionResult Index()
        {
            ViewBag.Pwd = pwd;
            return View();
        }

        [HttpPost]
        public ActionResult Index(string pwd)
        {
            if (pwd.Equals(this.pwd))
            {
                Session["myFinanceApp-Authentication"] = pwd;
                return RedirectToAction("Index");
            }
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}