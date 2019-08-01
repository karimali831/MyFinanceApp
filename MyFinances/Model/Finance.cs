using System;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity.ModelConfiguration;

namespace MyFinances.Model
{
    public class Finance
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal AvgMonthlyAmount { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? MonthlyDueDate { get; set; }
        public decimal? Remaining { get; set; }
        public decimal? TotalAmount { get; set; }
        public decimal? TotalPaid { get; set; }
        public bool Income { get; set; }
        public bool ManualPayment { get; set; }

    }

    public class FinanceMap : EntityTypeConfiguration<Finance>
    {
        public FinanceMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            // Table & Column Mappings
            this.ToTable("Finances");
            this.Property(t => t.Id).HasColumnName("Id");

            // Relationships

        }
    }
}
