using MyFinances.DTOs;
using MyFinances.Enums;
using MyFinances.ViewModels;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;

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

        public static string ToCurrency(decimal amount) => amount.ToString("C", CultureInfo.CreateSpecificCulture("en-GB"));

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

            string appendCurrency = showCurrency ? ToCurrency(difference) : difference.ToString();
            string formatAmount = string.Format("{0}{1}", appendText, appendCurrency);
            return highlight == false ? formatAmount : $"<span class='label label-{label}'>{formatAmount}</span>";
        }

        public static string ChartsHeaderTitle(IEnumerable<MonthComparisonChartVM> results, bool showTotal = false)
        {
            // exclude first month and last month records (because partial stored records)
            var averagedResults = results.Where(x => x.MonthName != DateTime.UtcNow.ToString("MMMM", CultureInfo.InvariantCulture) && x.YearMonth != "2019-07");

            string averagedMonthly = averagedResults.Any() ? ToCurrency(averagedResults.Average(x => x.Total)) : "";
 
            StringBuilder headerTitle = new StringBuilder();
            if (averagedMonthly != "")
            {
                headerTitle.Append($"Averaged monthly: {averagedMonthly}");
                headerTitle.Append(Environment.NewLine);
                headerTitle.Append($"Averaged daily: {ToCurrency(averagedResults.Average(x => x.Total) / 28)}");
                headerTitle.Append(Environment.NewLine);
            }

            if (showTotal)
            {
                headerTitle.Append($"Total spent: {ToCurrency(results.Sum(x => x.Total))}");
            }

            return headerTitle.ToString();
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
                       $"AND [{dateFilter.DateField}] < DATEADD(DAY, DATEDIFF(DAY, 0, GETUTCDATE()) + 1, 0)";
            }

            switch (dateFilter.Frequency)
            {
                case DateFrequency.Today:
                    return $"[{dateFilter.DateField}] = DATEADD(DAY, DATEDIFF(DAY, 0, GETUTCDATE()), 0)";
                case DateFrequency.Yesterday:
                    return $"[{dateFilter.DateField}] = DATEADD(DAY, DATEDIFF(DAY, 1, GETDATE()), 0)";
                case DateFrequency.Upcoming:
                    return $"[{dateFilter.DateField}] > DATEADD(DAY, DATEDIFF(DAY, 0, GETUTCDATE()), 0)";
                case DateFrequency.LastXDays:
                    return $"[{dateFilter.DateField}] >= DATEADD(DAY, DATEDIFF(DAY, 0, GETUTCDATE()), - {dateFilter.Interval})";
                case DateFrequency.LastXMonths:
                    return $"[{dateFilter.DateField}] >= DATEADD(MONTH, DATEDIFF(MONTH, 0, GETUTCDATE()) - {dateFilter.Interval}, DAY(GETUTCDATE())) - 1)";
                case DateFrequency.CurrentYear:
                    return $"YEAR([{dateFilter.DateField}]) = YEAR(GETUTCDATE())";
                case DateFrequency.PreviousYear:
                    return $"YEAR([{dateFilter.DateField}]) = YEAR(DATEADD(YEAR, -1, GETUTCDATE()))";
                case DateFrequency.AllTime:
                    return $"[{dateFilter.DateField}] <= GETUTCDATE()";
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
        public static int GetWeek(DateTime date)
        {
            var day = (int)CultureInfo.CurrentCulture.Calendar.GetDayOfWeek(date);
            return CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(date.AddDays(4 - (day == 0 ? 7 : day)), CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday);
        }

        public static MvcHtmlString Nl2Br(this HtmlHelper htmlHelper, string text)
        {
            if (string.IsNullOrEmpty(text))
                return MvcHtmlString.Create(text);
            else
            {
                StringBuilder builder = new StringBuilder();
                string[] lines = text.Split('\n');
                for (int i = 0; i < lines.Length; i++)
                {
                    if (i > 0)
                        builder.Append("<br/>\n");
                    builder.Append(HttpUtility.HtmlEncode(lines[i]));
                }
                return MvcHtmlString.Create(builder.ToString());
            }
        }
    }
}