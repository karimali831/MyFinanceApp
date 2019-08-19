using Dapper;
using DFM.Utils;
using MyFinances.DTOs;
using MyFinances.Enums;
using MyFinances.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MyFinances.Repository
{
    public interface ICNWRatesRepository
    {
        Task<CNWRates> GetAsync();
    }

    public class CNWRatesRepository : ICNWRatesRepository
    {
        private readonly Func<IDbConnection> dbConnectionFactory;
        private static readonly string TABLE = "CNWRates";
        private static readonly string[] FIELDS = typeof(CNWRates).DapperFields();

        public CNWRatesRepository(Func<IDbConnection> dbConnectionFactory)
        {
            this.dbConnectionFactory = dbConnectionFactory ?? throw new ArgumentNullException(nameof(dbConnectionFactory));
        }

        public async Task<CNWRates> GetAsync()
        {
            using (var sql = dbConnectionFactory())
            {
                return (await sql.QueryAsync<CNWRates>($"{DapperHelper.SELECT(TABLE, FIELDS)}")).Single(x => x.CurrentPeriod == true);
            }
        }
    }
}
