using System.Collections.Generic;
using Monzo;
using MyFinances.ViewModels;

namespace MyFinances.Website.ViewModels
{
    public sealed class AccountSummaryModel
    {
        public string Token { get; set; }
        public Account Account { get; set; }
        public decimal SpentToday { get; set; }
        public IList<MonzoTransaction> Transactions { get; set; }
        public IList<string> SyncedTransactions { get; set; }
        public Balance Balance { get; set; }
    }
}