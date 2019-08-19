using MyFinances.Enums;
using System;
using System.Data.Entity.ModelConfiguration;

namespace MyFinances.Model
{
    public class CNWPayment
    {
        public int Id { get; set; }
        public int? InvoiceNo { get; set; }
        public int Routes { get; set; }
        public decimal CalcMiles { get; set; }
        public decimal CalcRoutePay { get; set; }
        public decimal CalcMileagePay { get; set; }
        public decimal CalcTotalPay { get; set; }
        public decimal? ActualMiles { get; set; }
        public decimal? ActualRoutePay { get; set; }
        public decimal? ActualTotalPay { get; set; }
        public decimal AverageMpg { get; set; }
        public DateTime PayDate { get; set; }
        public int WeekNo { get; set; }
        public DateTime WeekDate { get; set; }
        public string Info { get; set; }
    }

    public class CNWPaymentMap : EntityTypeConfiguration<CNWPayment>
    {
        public CNWPaymentMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            // Table & Column Mappings
            this.ToTable("CNWPayments");
            this.Property(t => t.Id).HasColumnName("Id");

            // Relationships
        }
    }
}
