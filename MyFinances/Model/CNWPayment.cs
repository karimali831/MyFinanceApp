using DFM.Utils;
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
        public decimal? CalcSupportMiles { get; set; }
        public decimal CalcRoutePay { get; set; }
        public decimal CalcMileagePay { get; set; }
        public decimal? CalcSupportMileagePay { get; set; }
        public decimal? CalcSupportPay { get; set; }
        public int? CalcSupportDrops { get; set; }
        public decimal? CalcNetAmount { get; set; }
        public decimal CalcTotalPay { get; set; }
        [DbIgnore]
        public decimal? CalcTotalPayToDriver { get; set; }
        public decimal? ActualMiles { get; set; }
        public decimal? ActualRoutePay { get; set; }
        [DbIgnore]
        public decimal? ActualMileagePay { get; set; }
        public decimal? ActualSupportPay { get; set; }
        public decimal? ActualTotalPay { get; set; }
        [DbIgnore]
        public decimal? ActualNetAmount { get; set; }
        public decimal AverageMpg { get; set; }
        public DateTime PayDate { get; set; }
        public int WeekNo { get; set; }
        public DateTime WeekDate { get; set; }
        public decimal DeduVanRental { get; set; }
        public decimal DeduAdminFee { get; set; }
        public decimal DeduVanFines { get; set; }
        public decimal DeduVanDamages { get; set; }
        public decimal? Byod { get; set; }
        public string Info { get; set; }
        [DbIgnore]
        public CNWRates CNWRates { get; set; }
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
