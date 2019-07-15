﻿using System;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity.ModelConfiguration;

namespace MyFinances.Model
{
    public class Finance
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal AvgMonthlyCost { get; set; }
        public string Type { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public decimal? Remaining { get; set; }
        public decimal? Paid { get; set; }
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
