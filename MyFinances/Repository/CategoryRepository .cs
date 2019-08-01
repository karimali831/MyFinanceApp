using Dapper;
using DFM.Utils;
using MyFinances.Enums;
using MyFinances.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MyFinances.Repository
{
    public interface ICategoryRepository
    {
        Task<IEnumerable<Category>> GetAllAsync(CategoryType type);
    }

    public class CategoryRepository : ICategoryRepository
    {
        private readonly Func<IDbConnection> dbConnectionFactory;
        private static readonly string TABLE = "Categories";
        private static readonly string[] FIELDS = typeof(Category).DapperFields();

        public CategoryRepository(Func<IDbConnection> dbConnectionFactory)
        {
            this.dbConnectionFactory = dbConnectionFactory ?? throw new ArgumentNullException(nameof(dbConnectionFactory));
        }

        public async Task<IEnumerable<Category>> GetAllAsync(CategoryType type)
        {
            using (var sql = dbConnectionFactory())
            {
                return (await sql.QueryAsync<Category>($"{DapperHelper.SELECT(TABLE, FIELDS)}"))
                    .Where(x => x.Type == type)
                    .ToArray();
            }
        }
    }
}
