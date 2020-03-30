using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyFinances.ViewModels
{
    public class ChartVM
    {
        public ChartSummaryVM Summary { get; set; }
        public string Title { get; set; }
        public IEnumerable<MonthComparisonChartVM> Ds1 { get; set; }
        public IEnumerable<MonthComparisonChartVM> Ds2 { get; set; }
    }

    public class ChartSummaryVM
    {
        public string TitleDs1 { get; set; } = "Summary";
        public string TitleDs2 { get; set; } = "";
        public string AveragedDailyDs1 { get; set; }
        public string AveragedDailyDs2 { get; set; }
        public string AveragedMonthlyDs1 { get; set; }
        public string AveragedMonthlyDs2 { get; set; } 
        public string TotalSpentDs1 { get; set; } 
        public string TotalSpentDs2 { get; set; } 


    }
}
