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
        public IEnumerable<Category> Categories { get; set; }
        public IDictionary<CategoryType, IEnumerable<Category>> SecondCategories { get; set; }
    }
}