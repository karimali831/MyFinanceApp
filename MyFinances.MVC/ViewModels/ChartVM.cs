using MyFinances.DTOs;
using MyFinances.Enums;
using MyFinances.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyFinances.Website.ViewModels
{
    public class ChartVM
    {
        public string HeaderTitle { get; set; }
        public string Title { get; set; }
        public string TitleDs1 { get; set; }
        public string TitleDs2 { get; set; }
        public string Type { get; set; }
        public string Action { get; set; }
        public DateFilter Filter { get; set; }
        public string[] xAxis { get; set; }
        public decimal[] yAxisDs1 { get; set; }
        public decimal[] yAxisDs2 { get; set; }
        public int Width { get; set; } = 600;
        public int Height { get; set; } = 600;
    }
}