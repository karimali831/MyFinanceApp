using System.Data.Entity.ModelConfiguration;

namespace MyFinances.Model
{
    public class Finances
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class FinancesMap : EntityTypeConfiguration<Finances>
    {
        public FinancesMap()
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
