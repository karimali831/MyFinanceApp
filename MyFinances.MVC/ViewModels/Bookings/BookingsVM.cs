﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyFinances.Website.ViewModels.Finance
{
    /*
     * Only use view models in MVC project
     * if you need to add more properties 
     * than what is in the model itself 
     */
    public class FinanceVM
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}