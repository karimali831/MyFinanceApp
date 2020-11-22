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
    public interface ISpendingRepository
    {
        Task<IEnumerable<Spending>> GetAllAsync(DateFilter dateFilter);
        Task<IEnumerable<(int Year, int Month)>> MissedCreditCardInterestEntriesAsync(string card);
        Task<int?> GetIdFromFinanceAsync(int Id);
        Task MakeSpendingFinanceless(int id, int catId, int? secondCatId);
        (DateTime? Date, decimal Amount) ExpenseLastPaid(int financeId);
        Task InsertAsync(SpendingDTO dto);
        Task<IEnumerable<SpendingSummaryDTO>> GetSpendingsSummaryAsync(DateFilter dateFilter);
        Task<IEnumerable<MonthComparisonChartVM>> GetSpendingsByCategoryAndMonthAsync(DateFilter dateFilter, int catId, bool isSecondCat, bool isFinance);
        Task<IEnumerable<MonthComparisonChartVM>> GetSpendingsByMonthAsync(DateFilter dateFilter);
        Task<IEnumerable<SpecialCatsSpendingSummary>> GetSpecialCatsSpendingsSummaryAsync(DateFilter dateFilter);
        Task<IEnumerable<string>> RecentMonzoSyncedTranIds(int max);
    }

    public class SpendingRepository : ISpendingRepository
    {
        private readonly Func<IDbConnection> dbConnectionFactory;
        private static readonly string TABLE = "Spendings";
        private static readonly string[] FIELDS = typeof(Spending).DapperFields();
        private static readonly string[] DTOFIELDS = typeof(SpendingDTO).DapperFields();

        public SpendingRepository(Func<IDbConnection> dbConnectionFactory)
        {
            this.dbConnectionFactory = dbConnectionFactory ?? throw new ArgumentNullException(nameof(dbConnectionFactory));
        }

        public async Task<IEnumerable<Spending>> GetAllAsync(DateFilter dateFilter)
        {
            string sqlTxt =
                $@"SELECT 
                    s.Id,
                    s.Name,
                    s.Amount,
                    s.Date,
                    s.Info,
                    s.SecondCatId,
                    s.CashExpense,
					CASE WHEN s.CatId IS NULL THEN (SELECT CatID FROM Finances WHERE ID = s.FinanceId) ELSE s.CatId END AS CatId,
                    CASE WHEN c1.Name IS NULL THEN f.Name ELSE c1.Name END AS Category,
	                c2.Name AS SecondCategory,
                    s.FinanceId AS FinanceId,
                    s.MonzoTransId
                FROM {TABLE} s 
                LEFT JOIN Categories c1 
                    ON c1.Id = s.CatId
                LEFT JOIN Categories c2
                    ON c2.Id = s.SecondCatId
				LEFT JOIN Finances f 
                    ON f.Id = s.FinanceId
                WHERE 
                    Display = 1
                    {(dateFilter != null && dateFilter.Frequency.HasValue ? " AND " + Utils.FilterDateSql(dateFilter) : null)}";

            using (var sql = dbConnectionFactory())
            {
                return (await sql.QueryAsync<Spending>(sqlTxt)).ToArray();
            }
        }

        public async Task<IEnumerable<MonthComparisonChartVM>> GetSpendingsByMonthAsync(DateFilter dateFilter)
        {
            string sqlTxt = $@"
                SELECT 
	                CONVERT(CHAR(7), Date, 120) as YearMonth, 
	                DATENAME(month, Date) AS MonthName, SUM(Amount) as 'Total',
                    CASE WHEN c1.Id IS NULL THEN f.Id ELSE c1.ID END AS CatId,
                    c2.Id as SecondCatId,
	                CASE WHEN c1.Id IS NULL THEN 1 ELSE 0 END AS IsFinance,
                    c1.SuperCatId as SuperCatId1,
					c2.SuperCatId as SuperCatId2,
                    f.SuperCatId as FinanceSuperCatId
                FROM 
                    Spendings s
                LEFT JOIN Categories c1 
                    ON c1.Id = s.CatId
                LEFT JOIN Categories c2
                    ON c2.Id = s.SecondCatId
                LEFT JOIN Finances f 
                    ON f.Id = s.FinanceId
                WHERE 
                     {Utils.FilterDateSql(dateFilter)} 
                GROUP BY 
                    CONVERT(CHAR(7), Date, 120) , DATENAME(month, Date),
                    c1.Id, c2.Id, F.Id, c1.SuperCatId, c2.SuperCatId, f.SuperCatId
                ORDER BY 
                    YearMonth, Total DESC";
            

            using var sql = dbConnectionFactory();
            return (await sql.QueryAsync<MonthComparisonChartVM>(sqlTxt)).ToArray();
        }


        public async Task<IEnumerable<MonthComparisonChartVM>> GetSpendingsByCategoryAndMonthAsync(DateFilter dateFilter, int catId, bool isSecondCat, bool isFinance)
        {
            string sqlTxt;

            if (isSecondCat)
            {
                sqlTxt = $@"
                    SELECT 
	                    CONVERT(CHAR(7), Date, 120) as YearMonth, 
	                    DATENAME(month, Date) AS MonthName, SUM(Amount) as 'Total',
                        c1.Name AS Category,
                        c2.Name as SecondCategory,
                        c1.SuperCatId AS SuperCatId1,
						c2.SuperCatId AS SuperCatId2
                    FROM 
                        {TABLE} s
				    LEFT JOIN Categories c1 
                        ON c1.Id = s.CatId
                    LEFT JOIN Categories c2
                        ON c2.Id = s.SecondCatId
                    WHERE 
                        {Utils.FilterDateSql(dateFilter)} 
                    AND 
                        s.SecondCatId = @CatId
                    GROUP BY 
                        CONVERT(CHAR(7), Date, 120) , DATENAME(month, Date),
                        c1.Name, c2.Name, c1.SuperCatId, c2.SuperCatId
                    ORDER BY 
                        YearMonth";
            }
            else
            {
                var field = isFinance ? "s.FinanceId" : "s.CatId";

                sqlTxt = $@"
                    SELECT 
	                    CONVERT(CHAR(7), Date, 120) as YearMonth, 
	                    DATENAME(month, Date) AS MonthName, SUM(Amount) as 'Total',
                        CASE WHEN c1.Name IS NULL THEN f.Name ELSE c1.Name END AS Category,
                        CASE WHEN c1.Name IS NULL THEN 1 ELSE 0 END AS IsFinance,
                        c1.SuperCatId AS SuperCatId1,
                        f.SuperCatId AS FinanceSuperCatId
                    FROM 
                        {TABLE} s
				    LEFT JOIN Categories c1 
                        ON c1.Id = s.CatId
				    LEFT JOIN Finances f 
                        ON f.Id = s.FinanceId
                    WHERE 
                        {Utils.FilterDateSql(dateFilter)} 
                    AND 
                        {field} = @CatId
                    GROUP BY 
                        CONVERT(CHAR(7), Date, 120) , DATENAME(month, Date),
                        c1.Name, F.Name, c1.SuperCatId, f.SuperCatId
                    ORDER BY 
                        YearMonth";
            }

            using var sql = dbConnectionFactory();
            return (await sql.QueryAsync<MonthComparisonChartVM>(sqlTxt, new { CatId = catId })).ToArray();
        }

        public async Task<IEnumerable<SpecialCatsSpendingSummary>> GetSpecialCatsSpendingsSummaryAsync(DateFilter dateFilter)
        {
            string sqlTxt = $@"
                WITH SpecialCats AS  
                (
                    SELECT c.SuperCatId, c2.Name AS SuperCategory, SUM(s.Amount) as Total
	                FROM Spendings as s
	                LEFT JOIN Categories c ON c.Id = s.CatId
					LEFT JOIN Categories c2 ON c.SuperCatId = c2.Id
	                WHERE {Utils.FilterDateSql(dateFilter)} AND c.SuperCatId is not null
	                GROUP BY c.SuperCatId, c2.Name
                    UNION

                    SELECT c.SuperCatId, c2.Name, SUM(s.Amount)
	                FROM Spendings as s
	                LEFT JOIN Categories c ON c.Id = s.SecondCatId
					LEFT JOIN Categories c2 ON c.SuperCatId = c2.Id
	                WHERE {Utils.FilterDateSql(dateFilter)} AND c.SuperCatId is not null
	                GROUP BY c.SuperCatId, c2.Name

					UNION

					SELECT f.SuperCatId, c.Name AS SuperCategory, SUM(s.Amount) as Total
	                FROM Spendings as s
	                LEFT JOIN Finances f ON f.Id = s.FinanceId
	                LEFT JOIN Categories c ON c.Id = f.SuperCatId
					WHERE {Utils.FilterDateSql(dateFilter)} AND f.SuperCatId is not null
	                GROUP BY f.SuperCatId, c.Name
					
                ) 
                SELECT SuperCatId, SuperCategory, SUM(Total) AS Total
                FROM SpecialCats 
                GROUP BY SuperCatId, SuperCategory
                ORDER BY Total DESC";

            using (var sql = dbConnectionFactory())
            {
                return (await sql.QueryAsync<SpecialCatsSpendingSummary>(sqlTxt)).ToArray();

            }
        }

        public async Task<IEnumerable<SpendingSummaryDTO>> GetSpendingsSummaryAsync(DateFilter dateFilter)
        {
            string sqlTxt = $@"
                SELECT 
                    CASE WHEN s.CatId IS NULL THEN s.FinanceId ELSE s.CatId END AS CatId,
                    CASE WHEN s.SecondCatId IS NULL THEN s.FinanceId ELSE s.SecondCatId END AS SecondCatId,
					CASE WHEN c1.SuperCatId IS NULL THEN f.SuperCatId ELSE c1.SuperCatId END AS SuperCatId1,
					c2.SuperCatId as SuperCatId2,
                    CASE WHEN c1.Name IS NULL THEN f.Name ELSE c1.Name END AS Cat1,
					CASE WHEN c3.Name IS NULL THEN c5.Name ELSE c3.Name END AS SuperCat1,	
                    CASE WHEN s.CatId IS NULL THEN 1 ELSE 0 END AS IsFinance,
	                c2.Name AS Cat2, 
					c4.Name AS SuperCat2,
                    c1.SecondTypeId,					
					SUM(s.Amount) as Total
                FROM 
	                Spendings as s
	            LEFT JOIN Categories c1 
                    ON c1.Id = s.CatId 
	            LEFT JOIN Categories c2
                    ON c2.Id = s.SecondCatId
	            LEFT JOIN Finances f 
                    ON f.Id = s.FinanceId 
				LEFT JOIN Categories c3
					ON c3.Id = c1.SuperCatId
	            LEFT JOIN Categories c4 
                    ON c4.Id = c2.SuperCatId
				LEFT JOIN Categories c5
                    ON c5.Id = f.SuperCatId
                WHERE 
                    {Utils.FilterDateSql(dateFilter)}
                GROUP BY 
                    s.CatId, s.SecondCatId, s.FinanceId, c1.Name, c2.Name, f.Name, c1.SecondTypeId, c1.SuperCatId, c2.SuperCatId, f.SuperCatId, c3.Name, c4.Name, c5.Name
                ORDER BY 
                    Total DESC";

            using (var sql = dbConnectionFactory())
            {
                return (await sql.QueryAsync<SpendingSummaryDTO>(sqlTxt)).ToArray();

            }
        }

        public async Task<int?> GetIdFromFinanceAsync(int Id)
        {
            using (var sql = dbConnectionFactory())
            {
                return 
                    (await sql.QueryAsync<int?>($@"SELECT Id FROM {TABLE} WHERE FinanceId = @Id", new { Id })).FirstOrDefault();
            }
        }

        public async Task MakeSpendingFinanceless(int id, int catId, int? secondCatId = null)
        {
            using (var sql = dbConnectionFactory())
            {
                await sql.ExecuteAsync($@"
                    UPDATE {TABLE} SET CatId = @CatId, SecondCatId = @SecondCatId, FinanceId = null WHERE Id = @Id", 
                    new { 
                        CatId = catId,
                        SecondCatId = secondCatId,
                        Id = id
                    }
                );
            }
        }

        public (DateTime? Date, decimal Amount) ExpenseLastPaid(int financeId)
        {
            using (var sql = dbConnectionFactory())
            {
                return   
                    (sql.Query<(DateTime?, decimal)>($@"
                            SELECT Date, Amount
                            FROM Spendings
                            WHERE FinanceId = @FinanceId 
                            AND Amount != 0
                            ORDER BY Date DESC",
                            new { FinanceId = financeId }
                    ))
                    .FirstOrDefault();
            }
        }

        public async Task InsertAsync(SpendingDTO dto)
        {
            using (var sql = dbConnectionFactory())
            {
                await sql.ExecuteAsync($@"{DapperHelper.INSERT(TABLE, DTOFIELDS)}", dto);
            }
        }

        public async Task<IEnumerable<(int Year, int Month)>> MissedCreditCardInterestEntriesAsync(string card)
        {
            string sqlTxt = $@"
                DECLARE @start DATE = '2019-08-01' -- since records began
                DECLARE @end DATE = DATEADD(MONTH, DATEDIFF(MONTH, -1, GETUTCDATE())-1, -1) -- last Day of previous month

                ;WITH IntervalDates (date)
                AS
                (
                    SELECT @start
                    UNION ALL
                    SELECT DATEADD(MONTH, 1, date)
                    FROM IntervalDates
                    WHERE DATEADD(MONTH, 1, date)<=@end
                )
                SELECT YEAR(date) AS Year, MONTH(date) AS Month
                FROM IntervalDates

                EXCEPT

                SELECT DISTINCT YEAR(Date) AS yy, MONTH(Date) AS mm
                FROM Spendings
                WHERE Date BETWEEN @start AND @end 
                AND SecondCatId = {(int)Categories.CCInterest}
                AND Name like @Card
                ";

            using (var sql = dbConnectionFactory())
            {
                return (await sql.QueryAsync<(int Year, int Month)>(sqlTxt, new { Card = $"%{card}%" })).ToArray();

            }
        }

        public async Task<IEnumerable<string>> RecentMonzoSyncedTranIds(int max)
        {
            string sqlTxt = $@"
                ;WITH DistinctIds (monzoTransId, date) AS (
                    select distinct top(@max) monzoTransId, date from spendings
                    where MonzoTransId is not null
                )
                SELECT MonzoTransId from DistinctIds
                order by Date DESC";

            using (var sql = dbConnectionFactory())
            {
                return (await sql.QueryAsync<string>(sqlTxt, new { max })).ToArray();

            }
        }
    }
}
