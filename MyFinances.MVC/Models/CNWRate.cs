//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace MyFinances.Website.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class CNWRate
    {
        public int Id { get; set; }
        public decimal FullRoute { get; set; }
        public decimal HalfRoute { get; set; }
        public decimal MissortRoute { get; set; }
        public decimal Mileage { get; set; }
        public bool CurrentPeriod { get; set; }
        public decimal VATFlatRate { get; set; }
        public Nullable<decimal> VATRate { get; set; }
    }
}