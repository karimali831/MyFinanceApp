using MyFinances.Enums;
using MyFinances.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyFinances.ViewModels
{
    public class RemindersVM
    {
        public IEnumerable<Reminder> OverDueReminders { get; set; }
        public IEnumerable<Reminder> DueTodayReminders { get; set; }
        public IEnumerable<Reminder> UpcomingReminders { get; set; }
        public IEnumerable<Reminder> Alerts { get; set; }
    }
}
