using MyFinances.Enums;
using MyFinances.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyFinances.Website.ViewModels
{
    public class CategoriesVM
    {
        public IEnumerable<Category> SpendingCategories { get; set; }
        public IDictionary<CategoryType, IEnumerable<Category>> SpendingSecondCategories { get; set; }
        public IEnumerable<Category> IncomeCategories { get; set; }
        public IDictionary<CategoryType, IEnumerable<Category>> IncomeSecondCategories { get; set; }
    }
}