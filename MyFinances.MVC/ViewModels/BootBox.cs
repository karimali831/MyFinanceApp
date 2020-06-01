using System;
using System.Collections.Generic;
using Monzo;
using MyFinances.Enums;
using MyFinances.Model;
using MyFinances.ViewModels;

namespace MyFinances.Website.ViewModels
{
    public class BootBox
    {
        public string Title { get; set; }
        public string[] Description { get; set; }
        public bool Reload { get; set; } = false;
        public int TimeoutMs { get; set; } = 3000;
    }
}