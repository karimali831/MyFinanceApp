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
        public string Cat1 { get; set; }
        public string Cat2 { get; set; }
        public decimal TotalSpent { get; set; }
    }

    public class SpendingSummaryVM
    {
        public IEnumerable<SpendingSummaryDTO> FirstCats { get; set; }
        public IEnumerable<SecondCategories> SecondCats { get; set; }
        public decimal TotalSpent { get; set; }
    }

    public class SecondCategories
    {
        public string Category { get; set; }
        public decimal TotalSpent { get; set; }
        public IEnumerable<SpendingSummaryDTO> SecondCats { get; set; }
    }
}