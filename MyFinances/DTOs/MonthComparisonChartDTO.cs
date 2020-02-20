using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyFinances.DTOs
{
    public class MonthComparisonChartRequestDTO
    {
        public DateFilter Filter { get; set; }
        public int CatId { get; set; }
        public bool IsSecondCat { get; set; }
        public bool IsFinance { get; set; } 
    }
}
