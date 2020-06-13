﻿using Dapper;
using DFM.Utils;
using MyFinances.DTOs;
using MyFinances.Enums;
using MyFinances.Helpers;
using MyFinances.Model;
using MyFinances.ViewModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MyFinances.Repository
{
    public interface IIncomeRepository
    {
        Task<IEnumerable<Income>> GetAllAsync(DateFilter filter);
        Task<IEnumerable<IncomeSummaryDTO>> GetSummaryAsync(DateFilter dateFilter);
        Task InsertAsync(IncomeDTO dto);
        Task<IEnumerable<(int Year, int Week)>> MissedIncomeEntriesAsync(string dateColumn, int weekArrears, Categories category, string recsBegan = "2019-08-07");
        Task<IEnumerable<MonthComparisonChartVM>> GetIncomesByCategoryAndMonthAsync(DateFilter dateFilter, int catId, bool isSecondCat);
    }

    public class IncomeRepository : IIncomeRepository
    {
        private readonly Func<IDbConnection> dbConnectionFactory;
        private static readonly string TABLE = "Incomes";
        private static readonly string[] FIELDS = typeof(Income).DapperFields();
        private static readonly string[] DTOFIELDS = typeof(IncomeDTO).DapperFields();

        public IncomeRepository(Func<IDbConnection> dbConnectionFactory)
        {
            this.dbConnectionFactory = dbConnectionFactory ?? throw new ArgumentNullException(nameof(dbConnectionFactory));
        }

        public async Task<IEnumerable<Income>> GetAllAsync(DateFilter dateFilter)
        {
            using (var sql = dbConnectionFactory())
            {
                string sqlTxt = $@"
                    SELECT 
                        i.Id,
                        i.Name,
                        i.Date,
                        i.Amount,
                        i.SourceId,
                        i.SecondSourceId,
                        i.WeekNo,
                        c1.Name AS Source,
                        c2.Name AS SecondSource,
                        i.MonzoTransId
                    FROM {TABLE} i
                    INNER JOIN Categories c1
                        ON c1.Id = i.SourceId
                    LEFT JOIN Categories c2
                        ON c2.Id = i.SecondSourceId
                    {(dateFilter != null && dateFilter.Frequency.HasValue ? " WHERE " + Utils.FilterDateSql(dateFilter) : null)}";;

                return (await sql.QueryAsync<Income>(sqlTxt)).ToArray();
            }
        }

        public async Task<IEnumerable<IncomeSummaryDTO>> GetSummaryAsync(DateFilter dateFilter)
        {
            using (var sql = dbConnectionFactory())
            {
                string sqlTxt = $@"
                    SELECT 
	                    i.SourceId AS CatId,
						i.SecondSourceId AS SecondCatId,
	                    c1.Name AS Cat1,
                        c2.Name AS Cat2,
	                    SUM(i.Amount) as Total,
                        c1.SecondTypeId,
                        FORMAT(AVG(i.Amount), 'C', 'en-gb') as Average
                    FROM 
	                    {TABLE} as i
                    LEFT JOIN Categories c1
	                    ON c1.Id = i.SourceId
                    LEFT JOIN Categories c2
	                    ON c2.Id = i.SecondSourceId
                    WHERE 
                         {Utils.FilterDateSql(dateFilter)}
                    GROUP BY 
	                    i.SourceId, i.SecondSourceId, c1.Name, c2.Name, c1.SecondTypeId
                    ORDER BY 
	                    Total DESC";


                    return (await sql.QueryAsync<IncomeSummaryDTO>(sqlTxt)).ToArray();
            }
        }

        public async Task<IEnumerable<MonthComparisonChartVM>> GetIncomesByCategoryAndMonthAsync(DateFilter dateFilter, int catId, bool isSecondCat)
        {
            string sqlTxt = "";
            if (isSecondCat)
            {
                sqlTxt = $@"
                    SELECT 
	                    CONVERT(CHAR(7), Date, 120) as YearMonth, 
	                    DATENAME(month, Date) AS MonthName, SUM(Amount) as 'Total',
                        c1.Name as Category,
                        c2.Name as SecondCategory
                    FROM 
                        Incomes i
				    LEFT JOIN Categories c1 
                        ON c1.Id = i.SourceId
                    LEFT JOIN Categories c2
                        ON c2.Id = i.SecondSourceId
                    WHERE 
                        {Utils.FilterDateSql(dateFilter)} 
                    AND 
                        i.SecondSourceId = @CatId
                    GROUP BY 
                        CONVERT(CHAR(7), Date, 120) , DATENAME(month, Date),
                        c1.Name,  c2.Name
                    ORDER BY 
                        YearMonth";
            }
            else
            {
                sqlTxt = $@"
                    SELECT 
	                    CONVERT(CHAR(7), Date, 120) as YearMonth, 
	                    DATENAME(month, Date) AS MonthName, SUM(Amount) as 'Total',
                        c1.Name as Category
                    FROM 
                        Incomes i
				    LEFT JOIN Categories c1 
                        ON c1.Id = i.SourceId
                    LEFT JOIN Categories c2
                        ON c2.Id = i.SecondSourceId
                    WHERE 
                        {Utils.FilterDateSql(dateFilter)} 
                    AND 
                        i.SourceId = @CatId
                    GROUP BY 
                        CONVERT(CHAR(7), Date, 120) , DATENAME(month, Date),
                        c1.Name
                    ORDER BY 
                        YearMonth";
            }


            using (var sql = dbConnectionFactory())
            {
                return (await sql.QueryAsync<MonthComparisonChartVM>(sqlTxt, new { CatId = catId })).ToArray();
            }
        }

        public async Task InsertAsync(IncomeDTO dto)
        {
            using (var sql = dbConnectionFactory())
            {
                await sql.ExecuteAsync($@"{DapperHelper.INSERT(TABLE, DTOFIELDS)}", dto);
            }
        }

        public async Task<IEnumerable<(int Year, int Week)>> MissedIncomeEntriesAsync(string dateColumn, int weekArrears, Categories category, string recsBegan = "2019-08-07")
        {
            string sqlTxt = $@"
                DECLARE @start DATE = @RecsBegan -- since records began
                DECLARE @end DATE = DATEADD(WEEK, DATEDIFF(WEEK, -1, GETUTCDATE())-@WeekArrears, -1) 

                ;WITH IntervalDates (date)
                AS
                (
                    SELECT @start
                    UNION ALL
                    SELECT DATEADD(WEEK, 1, date)
                    FROM IntervalDates
                    WHERE DATEADD(WEEK, 1, date)<=@end
                )
                SELECT YEAR(date) AS Year, DATEPART(wk, date) AS Week
                FROM IntervalDates

                EXCEPT

                SELECT DISTINCT YEAR({dateColumn}) AS yy, DATEPART(wk, {dateColumn}) AS ww
                FROM {TABLE}
                WHERE SourceId = @IncomeStream
            ";

            using (var sql = dbConnectionFactory())
            {
                return (await sql.QueryAsync<(int Year, int Week)>(sqlTxt, 
                    new {
                        @IncomeStream = (int)category,
                        @DateColumn = dateColumn,
                        @WeekArrears = weekArrears,
                        @RecsBegan = recsBegan
                    }
                )).ToArray();

            }
        }
    }
}
