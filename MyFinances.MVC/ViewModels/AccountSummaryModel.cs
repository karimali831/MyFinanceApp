using System.Collections.Generic;
using Monzo;

namespace MyFinances.Website.ViewModels
{
    public sealed class AccountSummaryModel
    {
        public string Token { get; set; }
        public Account Account { get; set; }
        public decimal SpentToday { get; set; }
        public IList<Transaction> Transactions { get; set; }
        public Balance Balance { get; set; }
    }
}