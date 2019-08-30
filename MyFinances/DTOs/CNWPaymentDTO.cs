using MyFinances.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyFinances.DTOs
{
    public class CNWPaymentDTO
    {
        public int Routes { get; set; }
        public decimal CalcMiles { get; set; }
        public decimal CalcSupportMiles { get; set; }
        public decimal CalcSupportPay { get; set; }
        public decimal CalcSupportDrops { get; set; }
        public decimal CalcRoutePay { get; set; }
        public decimal CalcSupportMileagePay { get; set; }
        public decimal CalcMileagePay { get; set; }
        public decimal CalcTotalPay { get; set; }
        public decimal AverageMpg { get; set; }
        public DateTime WeekDate { get; set; }
    }
}
