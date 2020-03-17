using Dapper;
using DFM.Utils;
using MyFinances.DTOs;
using MyFinances.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace MyFinances.Repository
{
    public interface ISettingRepository
    {
        Task<Setting> GetAsync();
        Task UpdateAsync(Setting settings);
    }

    public class SettingRepository : ISettingRepository
    {
        private readonly Func<IDbConnection> dbConnectionFactory;
        private static readonly string TABLE = "Settings";
        private static readonly string[] FIELDS = typeof(Setting).DapperFields();

        public SettingRepository(Func<IDbConnection> dbConnectionFactory)
        {
            this.dbConnectionFactory = dbConnectionFactory ?? throw new ArgumentNullException(nameof(dbConnectionFactory));
        }


        public async Task<Setting> GetAsync()
        {
            using var sql = dbConnectionFactory();
            return (await sql.QueryAsync<Setting>($"{DapperHelper.SELECT(TABLE, FIELDS)}")).First();
        }

        public async Task UpdateAsync(Setting settings)
        {
            string sqlTxt = $@"
                UPDATE {TABLE} SET
                AvailableCredit = @AvailableCredit,
                StartingDate = @StartingDate
            ";

            using var sql = dbConnectionFactory();

            await sql.ExecuteAsync(sqlTxt, new 
            {
                settings.AvailableCredit,
                settings.StartingDate
            });
        }
    }
}
