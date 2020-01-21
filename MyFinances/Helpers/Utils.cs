using MyFinances.DTOs;
using MyFinances.Enums;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;

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
                var year = DateTime.UtcNow.Date >= freq.Date ? DateTime.UtcNow.Year : DateTime.UtcNow.Year - 1;
                return $"MONTH({dateFilter.DateField}) = {freq.Month} AND YEAR({dateFilter.DateField}) = {year} " +
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
                case DateFrequency.CurrentYear:
                    return $"YEAR([{dateFilter.DateField}]) = YEAR(GETDATE())";
                case DateFrequency.PreviousYear:
                    return $"YEAR([{dateFilter.DateField}]) = YEAR(DATEADD(YEAR, -1, GETDATE()))";
                default:
                    return "";
            }
        }

        public static string ResolveUrl(string originalUrl)
        {
            if (originalUrl == null)
                return null;

            // *** Absolute path - just return
            if (originalUrl.IndexOf("://") != -1)
                return originalUrl;

            // *** Fix up image path for ~ root app dir directory
            if (originalUrl.StartsWith("~"))
            {
                string newUrl = "";
                if (HttpContext.Current != null)
                    newUrl = HttpContext.Current.Request.ApplicationPath +
                          originalUrl.Substring(1).Replace("//", "/");
                else
                    // *** Not context: assume current directory is the base directory
                    throw new ArgumentException("Invalid URL: Relative URL not allowed.");

                // *** Just to be sure fix up any double slashes
                return newUrl.Replace("//", "/");
            }

            return originalUrl;
        }

        public static string ResolveServerUrl(string serverUrl, bool forceHttps)
        {
            // No HTTP context? Just return original URL
            if (HttpContext.Current == null)
                return serverUrl;

            // *** Is it already an absolute Url?
            if (serverUrl.IndexOf("://") > -1)
                return serverUrl;

            // *** Start by fixing up the Url an Application relative Url
            string newUrl = ResolveUrl(serverUrl);

            Uri originalUri = HttpContext.Current.Request.Url;
            newUrl = (forceHttps ? "https" : originalUri.Scheme) +
                     "://" + originalUri.Authority + newUrl;

            return newUrl;
        }

        public static string ResolveServerUrl(string serverUrl)
        {
            return ResolveServerUrl(serverUrl, false);
        }
    }
}