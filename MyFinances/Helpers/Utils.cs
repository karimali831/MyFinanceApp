﻿using MyFinances.DTOs;
using MyFinances.Enums;
using MyFinances.ViewModels;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;

namespace MyFinances.Helpers
{
    public static class Utils
    {
        public static string GetUntilOrEmpty(this string text, string stopAt = "*")
        {
            if (text.Contains(stopAt))
            {
                int charLocation = text.IndexOf(stopAt, StringComparison.Ordinal);

                if (charLocation > 0)
                {
                    return text.Substring(0, charLocation);
                }
            }

            return text;
        }

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

        public static T ToEnum<T>(this string value) where T : struct, IConvertible
        {
            if(Enum.TryParse(value, true, out T result))
            {
                return result;
            }
            else
            {
                return default;
            }
        }

        public static string GetDescription<T>(this T e) where T : IConvertible
        {
            if (e is Enum)
            {
                Type type = e.GetType();
                Array values = System.Enum.GetValues(type);

                foreach (int val in values)
                {
                    if (val == e.ToInt32(CultureInfo.InvariantCulture))
                    {
                        var memInfo = type.GetMember(type.GetEnumName(val));
                        var descriptionAttribute = memInfo[0]
                            .GetCustomAttributes(typeof(DescriptionAttribute), false)
                            .FirstOrDefault() as DescriptionAttribute;

                        if (descriptionAttribute != null)
                        {
                            return descriptionAttribute.Description;
                        }
                    }
                };
            }

            return null; // could also return string.Empty
        }


        public static string ChartsHeaderTitle(IEnumerable<MonthComparisonChartVM> data, ChartHeaderTitleType type)
        {
            if (type == ChartHeaderTitleType.Total)
            {
                return $"Total: {ToCurrency(data.Sum(x => x.Total))}";
            }

            // exclude first month and last month records (because partial stored records)
            var averagedResults = AveragedChartResults(data);
            int months = CountChartMonths(averagedResults);

            if (averagedResults.Any())
            {
                foreach (var item in averagedResults)
                {
                    int year = int.Parse(item.YearMonth.Split('-')[0]);
                    int month = int.Parse(item.YearMonth.Split('-')[1]);
                    item.DaysInMonth = DateTime.DaysInMonth(year, month);
                }

                switch (type)
                {
                    case ChartHeaderTitleType.Monthly:
                        return $"Averaged monthly: {ToCurrency(averagedResults.Sum(x => x.Total) / months)}";
  
                    case ChartHeaderTitleType.Daily:
                        return $"Averaged daily: {ToCurrency(averagedResults.Sum(x => x.Total / months / x.DaysInMonth))}";
                }
            }
            return "";
        }

        public static string ChartLabelFormat(string monthName, string yearMonth) 
            => string.Format("{0}-{1}", monthName.Substring(0, 3), yearMonth.Substring(2, 2));
        public static int CountChartMonths(IEnumerable<MonthComparisonChartVM> chart) 
            => chart.Select(x => ChartLabelFormat(x.MonthName, x.YearMonth)).Distinct().Count();
        public static IEnumerable<MonthComparisonChartVM> AveragedChartResults(IEnumerable<MonthComparisonChartVM> chart) 
            => chart.Where(x => x.YearMonth != DateTime.UtcNow.ToString("yyyy-MM", CultureInfo.InvariantCulture) && x.YearMonth != "2019-07");


        public static string[] ChartLabels(List<MonthComparisonChartVM[]> results)
        {
            return results
                .SelectMany(x => x)
                .Select(x => ChartLabelFormat(x.MonthName, x.YearMonth))
                .Distinct()
                .ToArray();
        }

        public static int? MonthsBetweenRanges(DateFilter filter)
        {
            int? fromMonth = null;
            int? toMonth = null;
            int? fromYear = null;
            int? toYear = null;

            switch (filter.Frequency)
            {
                case DateFrequency.AllTime:
                    fromMonth = 07;
                    toMonth = DateTime.Now.Month;
                    fromYear = 2019;
                    toYear = DateTime.Now.Year;
                    break;

                case DateFrequency.CurrentYear:
                    fromMonth = 01;
                    toMonth = DateTime.Now.Month;
                    fromYear = DateTime.Now.Year;
                    toYear = DateTime.Now.Year;
                    break;

                case DateFrequency.PreviousYear:
                    fromMonth = (DateTime.Now.Year - 1) == 2019 ? 07 : 01;
                    toMonth = 12;
                    fromYear = DateTime.Now.Year - 1;
                    toYear = DateTime.Now.Year - 1;
                    break;

                case DateFrequency.DateRange:
                    fromMonth = filter.FromDateRange?.Month;
                    toMonth = filter.ToDateRange?.Month;
                    fromYear = filter.FromDateRange?.Year;
                    toYear = filter.ToDateRange?.Year;
                    break;

                case DateFrequency.LastXMonths:
                    fromMonth = DateTime.Now.AddMonths(-filter.Interval ?? -1).Month;
                    toMonth = DateTime.Now.Month;
                    fromYear = DateTime.Now.AddMonths(-filter.Interval ?? -1).Year;
                    toYear = DateTime.UtcNow.Year;
                    break;
            }

            if (fromMonth.HasValue && toMonth.HasValue && fromYear.HasValue && toYear.HasValue)
            {
                return ((toYear - fromYear) * 12) + toMonth - fromMonth;
            }

            return null;
        }  

        public static bool ShowAverage(DateFilter filter)
        {
            if (!filter.Frequency.HasValue)
            {
                return false;
            }

            int minMonths = 2;

            if (filter.Frequency == DateFrequency.DateRange && filter.FromDateRange.HasValue && filter.ToDateRange.HasValue)
            {
                return MonthsBetweenRanges(filter).HasValue && MonthsBetweenRanges(filter).Value > minMonths ? true : false; 

            }
            else if (
                filter.Frequency == DateFrequency.AllTime ||
                (filter.Frequency == DateFrequency.CurrentYear && DateTime.Now.Month > minMonths) ||
                (filter.Frequency == DateFrequency.LastXMonths && filter.Interval.HasValue && filter.Interval.Value > minMonths) ||
                filter.Frequency == DateFrequency.PreviousYear) {
                    return true;
            }
            else
            {
                return false;
            }
        }

        public static string FilterDateSql(DateFilter dateFilter)
        {
            if (DateTime.TryParseExact(dateFilter.Frequency.ToString(), "MMMM", CultureInfo.InvariantCulture, DateTimeStyles.AllowWhiteSpaces, out DateTime freq))
            {
                var year = DateTime.UtcNow.Date >= freq.Date ? DateTime.UtcNow.Year : DateTime.UtcNow.Year - 1;
                return $"MONTH({dateFilter.DateField}) = {freq.Month} AND YEAR({dateFilter.DateField}) = {year} " +
                       $"AND [{dateFilter.DateField}] < DATEADD(DAY, DATEDIFF(DAY, 0, GETUTCDATE()) + 1, 0)";
            }

            var filteredDate = dateFilter.Frequency switch
            {
                DateFrequency.DateRange => $"{dateFilter.DateField} >= '{dateFilter.FromDateRange.Value:yyyy-MM-dd HH:mm}' AND {dateFilter.DateField} < '{dateFilter.ToDateRange.Value.AddDays(1):yyyy-MM-dd HH:mm}'",
                DateFrequency.Today => $"[{dateFilter.DateField}] >= DATEADD(DAY, DATEDIFF(DAY, 0, GETUTCDATE()), 0) AND [{dateFilter.DateField}] < DATEADD(DAY, DATEDIFF(DAY, 0, GETUTCDATE()), 1)",
                DateFrequency.Yesterday => $"[{dateFilter.DateField}] >= DATEADD(DAY, DATEDIFF(DAY, 1, GETDATE()), 0) AND [{dateFilter.DateField}] < DATEADD(DAY, DATEDIFF(DAY, 1, GETUTCDATE()), 1)",
                DateFrequency.Upcoming => $"[{dateFilter.DateField}] > DATEADD(DAY, DATEDIFF(DAY, 0, GETUTCDATE()), 0)",
                DateFrequency.LastXDays => $"[{dateFilter.DateField}] >= DATEADD(DAY, DATEDIFF(DAY, 0, GETUTCDATE()), - {dateFilter.Interval})",
                DateFrequency.LastXMonths => $"[{dateFilter.DateField}] >= DATEADD(MONTH, DATEDIFF(MONTH, 0, GETUTCDATE()) - {dateFilter.Interval}, DAY(GETUTCDATE()) - 1)",
                DateFrequency.CurrentYear => $"YEAR([{dateFilter.DateField}]) = YEAR(GETUTCDATE())",
                DateFrequency.PreviousYear => $"YEAR([{dateFilter.DateField}]) = YEAR(DATEADD(YEAR, -1, GETUTCDATE()))",
                DateFrequency.AllTime => $"[{dateFilter.DateField}] <= GETUTCDATE()",
                _ => "",
            };

            return filteredDate;
        }

        public static List<DateTime> GetMonthsBetween(DateTime from, DateTime to)
        {
            if (from > to) return GetMonthsBetween(to, from);

            var monthDiff = Math.Abs((to.Year * 12 + (to.Month - 1)) - (from.Year * 12 + (from.Month - 1)));

            if (from.AddMonths(monthDiff) > to || to.Day < from.Day)
            {
                monthDiff -= 1;
            }

            List<DateTime> results = new List<DateTime>();
            for (int i = monthDiff; i >= 1; i--)
            {
                results.Add(to.AddMonths(-i));
            }

            return results;
        }

        public static List<MonthComparisonChartVM> AddEmptyMonths(List<MonthComparisonChartVM> data, DateFilter dateFilter)
        {
            if (data != null && data.Any())
            {
                var firstDate = DateTime.Parse(data
                    .OrderBy(x => x.YearMonth)
                    .Select(x => x.YearMonth + "-01")
                    .FirstOrDefault());

                var lastDate = DateTime.Parse(data
                    .OrderByDescending(x => x.YearMonth)
                    .Select(x => x.YearMonth + "-01")
                    .FirstOrDefault());

                if (dateFilter.Frequency == DateFrequency.AllTime)
                {
                    lastDate = DateTime.UtcNow;
                }


                var monthYear = GetMonthsBetween(firstDate, lastDate)
                    .Select(x => x.ToString("yyyy-MM", CultureInfo.InvariantCulture));

                var zeroMonths = monthYear.Except(data.Select(x => x.YearMonth));

                if (zeroMonths.Any())
                {
                    foreach (var item in zeroMonths)
                    {
                        data.Add(new MonthComparisonChartVM
                        {
                            YearMonth = item,
                            MonthName = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(int.Parse(item.Split('-')[1])),
                            Total = 0,
                            Category = data[0].Category,
                            SecondCategory = data[0].SecondCategory

                        });
                    }
                }
            }

            return data
                .OrderBy(x => x.YearMonth)
                .ToList();
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

        public static int GetWeeksInYear(int year)
        {
            DateTimeFormatInfo dfi = DateTimeFormatInfo.CurrentInfo;
            DateTime date1 = new DateTime(year, 12, 31);
            Calendar cal = dfi.Calendar;
            return cal.GetWeekOfYear(date1, dfi.CalendarWeekRule,
                                                dfi.FirstDayOfWeek);
        }

        public static string GenerateRandomString(int length)
        {
            const string valid = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

            var sb = new StringBuilder();
            using (var provider = new RNGCryptoServiceProvider())
            {
                while (sb.Length != length)
                {
                    byte[] oneByte = new byte[1];
                    provider.GetBytes(oneByte);
                    char character = (char)oneByte[0];
                    if (valid.Contains(character))
                    {
                        sb.Append(character);
                    }
                }
            }

            return sb.ToString();
        }
    }
}