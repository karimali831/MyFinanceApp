using MyFinances.Enums;
using System;
using System.Data.Entity.ModelConfiguration;

namespace MyFinances.Model
{
    public class CNWRoute
    {
        public int Id { get; set; }
        public string RouteNo { get; set; }
        public string RouteType { get; set; }
        public CategoryType RouteTypeId { get; set; }
        public DateTime RouteDate { get; set; }
        public int? Mileage { get; set; }
        public int? Drops { get; set; }
        public int? ExtraDrops { get; set; }
        public string Info { get; set; }
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
