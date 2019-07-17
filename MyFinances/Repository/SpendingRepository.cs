using Dapper;
using DFM.Utils;
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
        Task InsertAsync(string name, int catId, decimal amount);
        Task UpdateAsync<T>(string field, T value, int id) where T : class;
        Task DeleteAsync(int Id);
    }

    public class SpendingRepository : ISpendingRepository
    {
        private readonly Func<IDbConnection> dbConnectionFactory;
        private static readonly string TABLE = "Spendings";
        private static readonly string[] FIELDS = typeof(Spending).DapperFields();

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
                    c.Name AS Category
                FROM {TABLE} s 
                INNER JOIN Categories c 
                    ON c.Id = s.CatId";

            using (var sql = dbConnectionFactory())
            {
                return (await sql.QueryAsync<Spending>(sqlTxt)).ToArray();
            }
        }

        public async Task InsertAsync(string name, int catId, decimal amount)
        {
            using (var sql = dbConnectionFactory())
            {
                await sql.ExecuteAsync($@"
                    INSERT INTO {TABLE} (Name, CatId, Amount) VALUES (@Name, @CatId, @Amount)", 
                    new {
                        Name = name,
                        CatId = catId,
                        Amount = amount
                    }
                );
            }
        }

        public async Task UpdateAsync<T>(string field, T value, int id) where T : class
        {
            using (var sql = dbConnectionFactory())
            {
                await sql.ExecuteAsync($@"
                    UPDATE {TABLE} SET {field} = @value WHERE Id = @id",
                    new
                    {
                        value,
                        id
                    }
                );
            }
        }

        public async Task DeleteAsync(int Id)
        {
            using (var sql = dbConnectionFactory())
            {
                await sql.ExecuteAsync($"{DapperHelper.DELETE(TABLE)} WHERE Id = @Id", new { Id });
            }
        }

    }
}
