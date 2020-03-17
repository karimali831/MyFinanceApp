using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyFinances.ViewModels
{
    public class Summary
    {
        public string CWTLCalculatedPay { get; set; }
        public int CWTLRoutesWorked { get; set; }
        public string CWTLTotalVanDamagesPaid { get; set; }
        public string EstimatedAvailableCredit { get; set; }
    }
}
