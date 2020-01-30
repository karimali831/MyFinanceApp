using MyFinances.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyFinances.ViewModels
{
    public class IncomeExpenseVM
    {
        public string YearMonth { get; set; }
        public string MonthName { get; set; }
        public decimal Total { get; set; }
        public CategoryType Type { get; set; }
    }
}
