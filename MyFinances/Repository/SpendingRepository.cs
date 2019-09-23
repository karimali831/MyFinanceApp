﻿using Dapper;
using DFM.Utils;
using MyFinances.DTOs;
using MyFinances.Enums;
using MyFinances.Helpers;
using MyFinances.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MyFinances.Repository 
{
    public interface ISpendingRepository
    {
        Task<IEnumerable<Spending>> GetAllAsync(DateFrequency? frequency = null, int? interval = null);
        Task<Spending> GetAsync(int Id);
        DateTime? ExpenseLastPaidDate(int financeId);
        Task InsertAsync(SpendingDTO dto);
        Task<IEnumerable<SpendingSummaryDTO>> GetSpendingsSummaryAsync(DateFrequency frequency, int interval);
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

        public async Task<IEnumerable<Spending>> GetAllAsync(DateFrequency? frequency = null, int? interval = null)
        {
            string sqlTxt =
                $@"SELECT 
                    s.Id,
                    s.Name,
                    s.Amount,
                    s.Date,
                    s.Info,
                    s.SecondCatId,
					CASE WHEN s.CatId IS NULL THEN (SELECT CatID FROM Finances WHERE ID = s.FinanceId) ELSE s.CatId END AS CatId,
                    CASE WHEN c1.Name IS NULL THEN f.Name ELSE c1.Name END AS Category,
	                c2.Name AS SecondCategory,
                    s.FinanceId AS FinanceId
                FROM {TABLE} s 
                LEFT JOIN Categories c1 
                    ON c1.Id = s.CatId
                LEFT JOIN Categories c2
                    ON c2.Id = s.SecondCatId
				LEFT JOIN Finances f 
                    ON f.Id = s.FinanceId
                WHERE 
                    Display = 1
                    {(frequency.HasValue && interval.HasValue ? Utils.FilterDateSql(frequency.Value, interval.Value) : null)}";

            using (var sql = dbConnectionFactory())
            {
                return (await sql.QueryAsync<Spending>(sqlTxt)).ToArray();
            }
        }

        public async Task<IEnumerable<SpendingSummaryDTO>> GetSpendingsSummaryAsync(DateFrequency frequency, int interval)
        {
            string sqlTxt = $@"
                SELECT 
                    CASE WHEN s.CatId IS NULL THEN s.FinanceId ELSE s.CatId END AS CatId,
                    CASE WHEN c1.Name IS NULL THEN f.Name ELSE c1.Name END AS Cat1,
                    CASE WHEN s.CatId IS NULL THEN 1 ELSE 0 END AS IsFinance,
	                c2.Name AS Cat2, SUM(s.Amount) as TotalSpent
                FROM 
	                {TABLE} as s
	            LEFT JOIN Categories c1 
                    ON c1.Id = s.CatId
	            LEFT JOIN Categories c2
                    ON c2.Id = s.SecondCatId
	            LEFT JOIN Finances f 
                    ON f.Id = s.FinanceId
                WHERE 
                    Display = 1
                    {Utils.FilterDateSql(frequency, interval)}
                GROUP BY 
                    s.CatId, s.FinanceId, c1.Name, c2.Name, f.Name
                ORDER BY 
                    TotalSpent DESC";

            using (var sql = dbConnectionFactory())
            {
                return (await sql.QueryAsync<SpendingSummaryDTO>(sqlTxt)).ToArray();

            }
        }

        public async Task<Spending> GetAsync(int Id)
        {
            using (var sql = dbConnectionFactory())
            {
                return 
                    (await sql.QueryAsync<Spending>($@"{DapperHelper.SELECT(TABLE, FIELDS)} WHERE Id = @Id", new { Id })).FirstOrDefault();
            }
        }

        public DateTime? ExpenseLastPaidDate(int financeId)
        {
            //AND Date >= DATEADD(mm, -1, CURRENT_TIMESTAMP) 

            using (var sql = dbConnectionFactory())
            {
                return   
                    (sql.Query<DateTime?>($@"
                            SELECT Date
                            FROM Spendings
                            WHERE FinanceId = @FinanceId 
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
    }
}
