using DFM.Utils;
using MyFinances.Enums;
using MyFinances.ViewModels;
using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;

namespace MyFinances.Models
{
    public class Monzo
    {
        public decimal Balance { get; set; }
        public string SortCode { get; set; }
        public string AccountNo { get; set; }
        public decimal SpentToday { get; set; }
        public string JsonTransactions { get; set; }
        public DateTime Created { get; set; }
        [DbIgnore]
        public IEnumerable<MonzoTransaction> Transactions { get; set; }
        
    }
}
