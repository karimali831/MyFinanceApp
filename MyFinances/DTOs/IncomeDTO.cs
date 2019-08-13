using MyFinances.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyFinances.DTOs
{
    public class IncomeDTO
    {
        public int SourceId { get; set; }
        public int SecondSourceId { get; set; }
        public DateTime Date { get; set; }
        public decimal Amount { get; set; }
    }
}
