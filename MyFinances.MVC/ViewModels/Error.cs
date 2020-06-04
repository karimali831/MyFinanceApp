using System;
using System.Collections.Generic;
using Monzo;
using MyFinances.Enums;
using MyFinances.Model;
using MyFinances.ViewModels;

namespace MyFinances.Website.ViewModels
{
    public class ErrorVM
    {
        public Exception Exception { get; set; }
    }
}