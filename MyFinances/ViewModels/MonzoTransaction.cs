using MyFinances.Enums;
using System;
using System.Collections;
using System.Data.Entity.ModelConfiguration;

namespace MyFinances.ViewModels
{
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
        public DateTime Created { get; set; }
    }
}
