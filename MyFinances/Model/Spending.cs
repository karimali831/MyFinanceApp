using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace MyFinances.Model
{
    public class Spending
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Info { get; set; }
        public int CatId { get; set; }
        public int? SecondCatId { get; set; }
        public string Category { get; set; }
        public string SecondCategory { get; set; }
        public int? FinanceId { get; set; }
        public string MonzoTransId { get; set; }
        public bool CashExpense { get; set; }
    }

    public class SpendingMap : EntityTypeConfiguration<Spending>
    {
        public SpendingMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            // Table & Column Mappings
            this.ToTable("Spendings");
            this.Property(t => t.Id).HasColumnName("Id");

            // Relationships
        }
    }
}
