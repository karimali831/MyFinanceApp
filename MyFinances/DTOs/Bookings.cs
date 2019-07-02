using MyFinances.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyFinances.DTOs
{
    public class FinancesDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public static FinancesDTO MapFrom(Finances Finances)
        {
            return new FinancesDTO
            {
                Id = Finances.Id,
                Name = Finances.Name
            };
        }
    }

    /*
     * usage: var dto = Finances.Select(b => FinancesDTO.MapFrom(b)).ToList();
    */
}
