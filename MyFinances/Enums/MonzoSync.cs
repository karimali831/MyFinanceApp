using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyFinances.Enums
{
    public enum MonzoSync
    {
        NotApplicable,
        // Income Names
        [Description("Amazon CWTL")]
        Pay,
        [Description("Amazon Flex")]
        Amazon,
        [Description("Uber Eats")]
        Uber,
        [Description("Saving pot top-ups")]
        pot_,
        // Direct Debits Names
        [Description("000000000039682227")]
        GtiRoadTax = 15,
        [Description("10002740315")]
        BlueMotorFinance = 32,
        [Description("T13823527125858685")]
        EEPhoneBill = 7
    }
}
