using Dapper;
using DFM.Utils;
using MyFinances.DTOs;
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
        Task<IEnumerable<Spending>> GetAllAsync();
        Task<Spending> GetAsync(int Id);
        bool PaidWithinLastWeek(int financeId);
        Task InsertAsync(SpendingDTO dto);
    }

    public class SpendingRepository : ISpendingRepository
    {
        private readonly Func<IDbConnection> dbConnectionFactory;
        private static readonly string TABLE = "Spendings";
        private static readonly string[]FIELDS = typeof(Spending).DapperFields();
        private static readonly string[] DTOFIELDS = typeof(SpendingDTO).DapperFields();

        public SpendingRepository(Func<IDbConnection> dbConnectionFactory)
        {
            this.dbConnectionFactory = dbConnectionFactory ?? throw new ArgumentNullException(nameof(dbConnectionFactory));
        }

        public async Task<IEnumerable<Spending>> GetAllAsync()
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
	                c2.Name AS SecondCategory
                FROM {TABLE} s 
                LEFT JOIN Categories c1 
                    ON c1.Id = s.CatId
                LEFT JOIN Categories c2
                    ON c2.Id = s.SecondCatId
				LEFT JOIN Finances f 
                    ON f.Id = s.FinanceId
                WHERE 
                    Display = 1";

            using (var sql = dbConnectionFactory())
            {
                return (await sql.QueryAsync<Spending>(sqlTxt)).ToArray();
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

        public bool PaidWithinLastWeek(int financeId)
        {
            using (var sql = dbConnectionFactory())
            {
                return   
                    (sql.Query<bool>($@"
                            SELECT 1
                            FROM Spendings
                            WHERE FinanceId = @FinanceId 
                            AND Date >= DATEADD(dd, -7, CURRENT_TIMESTAMP) 
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
