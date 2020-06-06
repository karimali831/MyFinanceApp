using Dapper;
using DFM.Utils;
using MyFinances.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace MyFinances.Repository
{
    public interface IBaseRepository
    {
        Task UpdateAsync<T>(string field, T value, int id, string table) where T : class;
        Task DeleteAsync(int Id, string table);
        Task<IList<(string, int)>> CheckDuplicates(string column, string table);
    }

    public class BaseRepository : IBaseRepository
    {
        private readonly Func<IDbConnection> dbConnectionFactory;
        private static readonly string[] FIELDS = typeof(Finance).DapperFields();

        public BaseRepository(Func<IDbConnection> dbConnectionFactory)
        {
            this.dbConnectionFactory = dbConnectionFactory ?? throw new ArgumentNullException(nameof(dbConnectionFactory));
        }

        public async Task<IList<(string, int)>> CheckDuplicates(string column, string table)
        {
            using (var sql = dbConnectionFactory())
            {
                return (await sql.QueryAsync<(string, int)>($@"
                    SELECT {column}, COUNT(*) As Duplicates
                    FROM {table}
                    WHERE {column} is not null
                    GROUP BY {column} 
                    HAVING COUNT(*) > 1
                "))
                .ToList();
            }
        }

        public async Task UpdateAsync<T>(string field, T value, int id, string table) where T : class
        {
            using (var sql = dbConnectionFactory())
            {
                await sql.ExecuteAsync($@"
                    UPDATE {table} SET {field} = @value WHERE Id = @id",
                    new
                    {
                        value,
                        id
                    }
                );
            }
        }

        public async Task DeleteAsync(int Id, string table)
        {
            using (var sql = dbConnectionFactory())
            {
                await sql.ExecuteAsync($"{DapperHelper.DELETE(table)} WHERE Id = @Id", new { Id });
            }
        }

    }
}
