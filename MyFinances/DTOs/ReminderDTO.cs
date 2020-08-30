using MyFinances.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyFinances.DTOs
{
    public class ReminderDTO
    {
        public string Notes { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime AddedDate => DateTime.UtcNow;
        public Priority Priority { get; set; }
        public Categories CatId { get; set; }
        public string MonzoTransId { get; set; }
    }
}
