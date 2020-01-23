using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyFinances.ViewModels
{
    public class MissedCCEntries
    {
        public string Card { get; set; }
        public int[] Year { get; set; }
        public int[] Month { get; set; }
    }
}
