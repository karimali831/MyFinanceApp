using System;
using System.Collections.Generic;
using Monzo;
using MyFinances.Model;
using MyFinances.ViewModels;

namespace MyFinances.Website.ViewModels
{
    public sealed class AddTransactionVM
    {
        public IEnumerable<FinanceVM> Finances { get; set; }
        public IEnumerable<Category> Categories { get; set; }
        public IEnumerable<Category> SecondCategories { get; set; }
        public string MonzoTransId { get; set; }
        public int? SelectedId { get; set; }
        public bool? IsFinance { get; set; }
        public string Name { get; set; }
        public long Amount { get; set; }
        public string Date { get; set; }
    }
}