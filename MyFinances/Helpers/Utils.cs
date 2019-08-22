using System;
using System.Linq;

namespace MyFinances.Helpers
{
    public static class Utils
    {
        public static string FirstCharToUpper(this string input)
        {
            switch (input)
            {
                case null: throw new ArgumentNullException(nameof(input));
                case "": throw new ArgumentException($"{nameof(input)} cannot be empty", nameof(input));
                default: return input.First().ToString().ToUpper() + input.Substring(1);
            }
        }

        public static string AmountDifference(decimal? firstValue, decimal? secondValue, string currency = "£", bool highlight = true)
        {
            if (!firstValue.HasValue || !secondValue.HasValue || firstValue.Value == 0)
                return "";

            decimal difference = firstValue.Value - secondValue.Value;

            string label;
            switch (difference)
            {
                case var expression when (difference < 0 && difference >= -10):
                    label = "warning";
                    break;

                case var expression when difference < 0:
                    label = "danger";
                    break;

                case var expression when difference > 0:
                    label = "success";
                    break;

                default:
                    label = "default";
                    break;
            }

            string formatAmount = string.Format("{0}{1}", currency, difference.ToString("#.##"));
            return highlight == false ? formatAmount : $"<span class='label label-{label}'>{formatAmount}</span>";
        }
    }
}