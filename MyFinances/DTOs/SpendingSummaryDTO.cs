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
        public decimal FuelCost { get; set; }
        public decimal[] FuelCostByType { get; set; }
        public decimal FoodCost { get; set; }
        public decimal InterestAndFees { get; set; }
        public decimal OverdraftFees { get; set; }
    }
}
