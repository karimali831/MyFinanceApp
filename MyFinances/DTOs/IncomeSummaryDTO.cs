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
        public string Source { get; set; }
        public int SourceId { get; set; }
        public string SecondSource { get; set; }
        public IEnumerable<IncomeSummaryDTO> SecondCats { get; set; }
        public decimal TotalIncome { get; set; }
    }
}
