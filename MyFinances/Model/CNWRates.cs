using MyFinances.Enums;
using System.Data.Entity.ModelConfiguration;

namespace MyFinances.Model
{
    public class CNWRates
    {
        public int Id { get; set; }
        public int FullRoute { get; set; }
        public int HalfRoute { get; set; }
        public int MissortRoute { get; set; }
        public decimal Mileage { get; set; }
        public decimal VanRental { get; set; }
        public decimal AdminFee { get; set; }
        public bool CurrentPeriod { get; set; }
    }

    public class CNWRatesMap : EntityTypeConfiguration<CNWRates>
    {
        public CNWRatesMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            // Table & Column Mappings
            this.ToTable("CNWRates");
            this.Property(t => t.Id).HasColumnName("Id");

            // Relationships
        }
    }
}
