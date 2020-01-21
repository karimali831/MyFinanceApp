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
    
    public partial class Finance
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Finance()
        {
            this.Spendings = new HashSet<Spending>();
        }
    
        public int Id { get; set; }
        public string Name { get; set; }
        public Nullable<decimal> AvgMonthlyAmount { get; set; }
        public Nullable<System.DateTime> StartDate { get; set; }
        public Nullable<System.DateTime> EndDate { get; set; }
        public Nullable<decimal> Remaining { get; set; }
        public Nullable<decimal> TotalAmount { get; set; }
        public Nullable<decimal> TotalPaid { get; set; }
        public Nullable<int> MonthlyDueDate { get; set; }
        public Nullable<System.DateTime> NextDueDate { get; set; }
        public int OverrideNextDueDate { get; set; }
        public int CatId { get; set; }
        public int ManualPayment { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Spending> Spendings { get; set; }
    }
}
