using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyFinances.ViewModels
{
    public class ChartVM
    {
        public string HeaderTitle { get; set; }
        public string Title { get; set; }
        public IEnumerable<MonthComparisonChartVM> Data { get; set; }
    }
}
