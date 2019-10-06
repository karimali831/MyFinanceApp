using MyFinances.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyFinances.DTOs
{
    public class DateFilter
    {
        public DateFrequency? Frequency { get; set; }
        public int? Interval { get; set; }
        public string DateField { get; set; } = "Date";
        public DateTime? FromDateRange { get; set; }
        public DateTime? ToDateRange { get; set; }
    }
}
