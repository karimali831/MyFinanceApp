﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyFinances.DTOs
{
    public class MonthComparisonChartRequestDTO
    {
        public DateFilter DateFilter { get; set; }
        public int CatId { get; set; }
        public int? SecondCatId { get; set; }
        public bool IsFinance { get; set; } 
    }
}
