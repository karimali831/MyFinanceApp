using MyFinances.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyFinances.Website.ViewModels
{
    public class WeekSummaryVM
    {
        public CNWPayment Payment { get; set; }
        public IEnumerable<CNWRoute> Routes { get; set; }
    }
}