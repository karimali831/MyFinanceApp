using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyFinances.Website.ViewModels.Finances
{
    /*
     * Only use view models in MVC project
     * if you need to add more properties 
     * than what is in the model itself 
     */
    public class FinancesVM
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}