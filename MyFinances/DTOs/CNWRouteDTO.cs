using MyFinances.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyFinances.DTOs
{
    public class CNWRouteDTO
    {
        public int RouteTypeId { get; set; }
        public DateTime RouteDate { get; set; }
        public decimal? Mileage { get; set; }
        public decimal? Mpg { get; set; }
        public int? ExtraDrops { get; set; }
        public decimal? ExtraMileage { get; set; }
        public string Info { get; set; }
        public decimal FuelCost { get; set; }
        public decimal? CoFuel { get; set; }
    }
}