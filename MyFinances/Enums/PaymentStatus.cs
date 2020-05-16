using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyFinances.Enums
{
    public enum PaymentStatus
    {
        Ended,
        Paid,
        Upcoming,
        Late,
        Unknown,
        DueToday
    }
}
