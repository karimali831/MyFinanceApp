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
        public decimal SavingsBalance { get; set; }
        public string SortCode { get; set; }
        public string AccountNo { get; set; }
        public decimal SpentToday { get; set; }
        public string JsonTransactions { get; set; }
        public DateTime Created { get; set; }
        [DbIgnore]
        public IEnumerable<MonzoTransaction> Transactions { get; set; }
        
    }

    public class MonzoTransaction
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string Logo { get; set; }
        public decimal Amount { get; set; }
        public string Notes { get; set; }
        public string Settled { get; set; }
        public string DeclineReason { get; set; }
        public DateTime Created { get; set; }
    }
}
