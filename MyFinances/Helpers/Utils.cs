using MyFinances.DTOs;
using MyFinances.Enums;
using System;
using System.Collections.Generic;
using System.Globalization;
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

        public static decimal CalculateVat(decimal value)
        {
            return (value / 100) * 20;
        }

        public static string AmountDifference(decimal? firstValue, decimal? secondValue, bool showCurrency = true, string appendText = "", bool highlight = true)
        {
            if (!firstValue.HasValue || !secondValue.HasValue)
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

            string appendCurrency = showCurrency ? difference.ToString("C", CultureInfo.CreateSpecificCulture("en-GB")) : difference.ToString();
            string formatAmount = string.Format("{0}{1}", appendText, appendCurrency);
            return highlight == false ? formatAmount : $"<span class='label label-{label}'>{formatAmount}</span>";
        }

        public static string FilterDateSql(DateFilter dateFilter)
        {
            if (dateFilter.FromDateRange.HasValue && dateFilter.ToDateRange.HasValue)
            {
                return $"{dateFilter.DateField} >= '{dateFilter.FromDateRange.Value}' AND {dateFilter.DateField} <= '{dateFilter.ToDateRange.Value}'";
            }

            if (DateTime.TryParseExact(dateFilter.Frequency.ToString(), "MMMM", CultureInfo.InvariantCulture, DateTimeStyles.AllowWhiteSpaces, out DateTime freq))
            {
                var year = DateTime.UtcNow.Month <= freq.Month ? DateTime.UtcNow.Year : DateTime.UtcNow.Year - 1;
                return $"MONTH({dateFilter.DateField}) = {freq.Month} AND YEAR({dateFilter.DateField}) = {DateTime.UtcNow.Year} " +
                       $"AND [{dateFilter.DateField}] < DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()) + 1, 0)";
            }

            switch (dateFilter.Frequency)
            {
                case DateFrequency.Today:
                    return $"[{dateFilter.DateField}] >= DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()), 0) AND " +
                           $"[{dateFilter.DateField}] < DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()) + 1, 0)";
                case DateFrequency.Yesterday:
                    return $"[{dateFilter.DateField}] >= DATEADD(DAY, DATEDIFF(DAY, 1, GETDATE()), 0) AND " +
                           $"[{dateFilter.DateField}] < DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()), 0)";
                case DateFrequency.Upcoming:
                    return $"[{dateFilter.DateField}] >= DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()), 0)";
                case DateFrequency.LastXDays:
                    return $"[{dateFilter.DateField}] >= DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()), - {dateFilter.Interval})";
                case DateFrequency.LastXMonths:
                    return $"[{dateFilter.DateField}] >= DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()) - {dateFilter.Interval}, DAY(GETDATE()) - 1)";
                default:
                    return "";
            }
        }
    }
}