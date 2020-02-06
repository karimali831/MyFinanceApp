using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyFinances.Enums
{
    // to find these query categories where typeid is not 0
    public enum CategoryType
    {
        Spendings,
        Income,
        CNWRouteType,
        Vehicles,
        Maintenance,
        IncomeSources,
        InterestFeesCharges = 13,
        Full = 21,
        Half,
        Missort,
        CWTL = 33,
        UberEats,
        CCInterest = 42,
        MissedEntries = 1140
    }
}
