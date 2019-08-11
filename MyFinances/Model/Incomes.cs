using MyFinances.Enums;
using System;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity.ModelConfiguration;

namespace MyFinances.Model
{
    public class Income
    {
        public int Id { get; set; }
        public string Source { get; set; }
        public Categories SourceId { get; set; }  
        public DateTime Date { get; set; }
        public decimal Amount { get; set; }

    }

    public class IncomeMap : EntityTypeConfiguration<Income>
    {
        public IncomeMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            // Table & Column Mappings
            this.ToTable("Incomes");
            this.Property(t => t.Id).HasColumnName("Id");

            // Relationships

        }
    }
}
