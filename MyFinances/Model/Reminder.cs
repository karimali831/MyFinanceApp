using MyFinances.Enums;
using System;
using System.Data.Entity.ModelConfiguration;

namespace MyFinances.Model
{
    public class Reminder
    {
        public int Id { get; set; }
        public string Notes { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime AddedDate { get; set; }
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
