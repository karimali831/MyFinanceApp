using MyFinances.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyFinances.DTOs
{
    public class SpendingSummaryDTO
    {
        public decimal TotalSpent { get; set; }
        public decimal TotalFuelCost { get; set; }
        public decimal[] TotalFuelCostByType { get; set; }
        public decimal TotalFoodCost { get; set; }
    }
}
