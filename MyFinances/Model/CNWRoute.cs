using DFM.Utils;
using MyFinances.Enums;
using System;
using System.Data.Entity.ModelConfiguration;

namespace MyFinances.Model
{
    public class CNWRoute
    {
        public int Id { get; set; }
        public int WeekNo { get; set; }
        [DbIgnore]
        public string RouteType { get; set; }
        public Categories RouteTypeId { get; set; }
        public DateTime RouteDate { get; set; }
        public decimal Mileage { get; set; }
        public decimal Mpg { get; set; }
        public int? ExtraDrops { get; set; }
        public decimal? ExtraMileage { get; set; }
        public string Info { get; set; }
        public decimal FuelCost { get; set; }
        public decimal? CoFuel { get; set; }
        [DbIgnore]
        public decimal EstimatedFuelCost { get; set; }
    }

    public class CNWRouteMap : EntityTypeConfiguration<CNWRoute>
    {
        public CNWRouteMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            // Table & Column Mappings
            this.ToTable("CNWRoutes");
            this.Property(t => t.Id).HasColumnName("Id");

            // Relationships
        }
    }
}
