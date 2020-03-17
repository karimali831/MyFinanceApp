using DFM.Utils;
using MyFinances.Enums;
using System;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity.ModelConfiguration;

namespace MyFinances.Model
{
    public class Setting
    {
        public int Id { get; set; }
        public decimal AvailableCredit { get; set; }
        public DateTime StartingDate { get; set; }
    }

    public class SettingMap : EntityTypeConfiguration<Setting>
    {
        public SettingMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            // Table & Column Mappings
            this.ToTable("Settings");
            this.Property(t => t.Id).HasColumnName("Id");

            // Relationships

        }
    }
}
