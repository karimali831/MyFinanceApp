using MyFinances.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyFinances.DTOs
{
    public class IncomeSummaryDTO
    {
        public decimal TotalIncome { get; set; }
        public decimal IncomeCWTL { get; set; }
        public decimal IncomeSB { get; set; }
        public decimal IncomeUberEats { get; set; }
    }
}
