using MyFinances.Enums;
using System;
using System.Data.Entity.ModelConfiguration;

namespace MyFinances.ViewModels
{
    public class MonzoTransaction
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public string Logo { get; set; }
        public long Amount { get; set; }
        public DateTime Created { get; set; }
    }
}
