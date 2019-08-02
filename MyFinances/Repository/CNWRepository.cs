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
    public interface ICNWRepository
    {
        Task<IEnumerable<CNWRoute>> GetAllAsync();
        Task InsertAsync(CNWRouteDTO dto);
    }

    public class CNWRepository : ICNWRepository
    {
        private readonly Func<IDbConnection> dbConnectionFactory;
        private static readonly string TABLE = "CNWRoutes";
        private static readonly string[] FIELDS = typeof(CNWRoute).DapperFields();
        private static readonly string[] DTOFIELDS = typeof(CNWRouteDTO).DapperFields();

        public CNWRepository(Func<IDbConnection> dbConnectionFactory)
        {
            this.dbConnectionFactory = dbConnectionFactory ?? throw new ArgumentNullException(nameof(dbConnectionFactory));
        }

        public async Task<IEnumerable<CNWRoute>> GetAllAsync()
        {
            using (var sql = dbConnectionFactory())
            {
                return (await sql.QueryAsync<CNWRoute>($"{DapperHelper.SELECT(TABLE, FIELDS)}"))
                    .Where(x => x.RouteTypeId == CategoryType.CNWRouteType)
                    .ToArray();
            }
        }

        public async Task InsertAsync(CNWRouteDTO dto)
        {
            using (var sql = dbConnectionFactory())
            {
                await sql.ExecuteAsync($@"{DapperHelper.INSERT(TABLE, DTOFIELDS)}", dto);
            }
        }
    }
}
