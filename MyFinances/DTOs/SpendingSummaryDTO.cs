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
        public int Cat1Id { get; set; }
        public string Cat2 { get; set; }
        public IEnumerable<SpendingSummaryDTO> SecondCats { get; set; }
        public decimal TotalSpent { get; set; }
    }
}