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
    public interface IFinancesRepository
    {
        Task<IEnumerable<Finances>> GetAllAsync();
    }

    public class FinancesRepository : IFinancesRepository
    {
        private readonly Func<IDbConnection> dbConnectionFactory;
        private static readonly string TABLE = "Finances";
        private static readonly string[] FIELDS = typeof(Finances).DapperFields();

        public FinancesRepository(Func<IDbConnection> dbConnectionFactory)
        {
            this.dbConnectionFactory = dbConnectionFactory ?? throw new ArgumentNullException(nameof(dbConnectionFactory));
        }

        public async Task<IEnumerable<Finances>> GetAllAsync()
        {
            using (var sql = dbConnectionFactory())
            {
                return (await sql.QueryAsync<Finances>($"{DapperHelper.SELECT(TABLE, FIELDS)}")).ToArray();
            }
        }
    }
}
