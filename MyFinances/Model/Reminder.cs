﻿using DFM.Utils;
using MyFinances.Enums;
using System;
using System.Data.Entity.ModelConfiguration;

namespace MyFinances.Model
{
    public class Reminder
    {
        public int Id { get; set; }
        public string Notes { get; set; }
        public DateTime? DueDate { get; set; }
        [DbIgnore]
        public PaymentStatus PaymentStatus { get; set; }
        [DbIgnore]
        public int? DaysUntilDue { get; set; }
        public DateTime AddedDate { get; set; }
        public bool Display { get; set; }
        public Priority _priority { get; set; }
        [DbIgnore]
        public string Priority
        {
            get { return _priority.ToString(); }
            set { Priority = value; }
        }
        public string Category { get; set; }
        [DbIgnore]
        public int Sort { get; set; } = 1;
    }

    public class ReminderMap : EntityTypeConfiguration<Reminder>
    {
        public ReminderMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            // Table & Column Mappings
            this.ToTable("Reminders");
            this.Property(t => t.Id).HasColumnName("Id");

            // Relationships
        }
    }
}
