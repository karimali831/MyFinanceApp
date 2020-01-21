using MyFinances.Enums;
using MyFinances.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyFinances.Website.ViewModels
{
    public class SpendingsSummaryChartVM
    {
        public DateFrequency Frequency { get; set; }
        public string[] Categories { get; set; }
        public decimal[] Total { get; set; }
    }
}