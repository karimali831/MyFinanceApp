using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MyFinances.Controllers
{
    public class HomeController : Controller
    { 
        public string pwd = "5424";
        private string reactBundleJS = Directory.GetFiles("C:/Projects/MyFinanceApp/MyFinances.MVC/Scripts/React/build/static/js", "*.js")?[0];

        public ActionResult Index()
        {
            ViewBag.Pwd = pwd;
            ViewBag.ReactBundleJS = Path.GetFileName(reactBundleJS);

            if (string.IsNullOrEmpty(reactBundleJS))
            {
                ViewBag.ErrorMessage = "The react build is currently running or not working";
            }

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

            ViewBag.ErrorMessage = "The password was entered incorrectly";
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