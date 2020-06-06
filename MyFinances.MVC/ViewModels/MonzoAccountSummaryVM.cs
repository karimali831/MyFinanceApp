using System;
using System.Collections.Generic;
using Monzo;
using MyFinances.Enums;
using MyFinances.ViewModels;

namespace MyFinances.Website.ViewModels
{
    public class MonzoAccountSummaryVM
    {
        public string Token { get; set; }
        public string SortCode { get; set; }
        public string AccountNo { get; set; }
        public decimal SpentToday { get; set; }
        public IList<MonzoTransaction> Transactions { get; set; }
        public IDictionary<CategoryType, (IList<string> Transactions, string Syncables)> SyncedTransactions { get; set; }
        public decimal Balance { get; set; }
        public BootBox Modal { get; set; }
        public DateTime LastSynced { get; set; }
        public IList<Transaction> TransactionMetaData { get; set; }
    }
}