﻿using MyFinances.Enums;
using System.Data.Entity.ModelConfiguration;

namespace MyFinances.Model
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public CategoryType TypeId { get; set; }
        public CategoryType? SecondTypeId { get; set; }
        public bool Disabled { get; set; }
        public string MonzoTag { get; set; }
    }

    public class CategoryMap : EntityTypeConfiguration<Category>
    {
        public CategoryMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            // Table & Column Mappings
            this.ToTable("Categories");
            this.Property(t => t.Id).HasColumnName("Id");

            // Relationships
        }
    }
}
