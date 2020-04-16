using MyFinances.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyFinances.ViewModels
{
    public class MonthComparisonChartVM
    {
        public string YearMonth { get; set; }
        public string MonthName { get; set; }
        public decimal Total { get; set; }
        public CategoryType Type { get; set; }
        public string Category { get; set; }
        public string SecondCategory { get; set; }
        public bool IsFinance { get; set; } = false;
        public int DaysInMonth { get; set; }
    }
}
