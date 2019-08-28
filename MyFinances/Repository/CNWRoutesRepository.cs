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
    public interface ICNWRoutesRepository
    {
        Task<IEnumerable<CNWRoute>> GetAllAsync(int? weekNo = null);
        Task<CNWRoute> GetAsync(int Id);
        Task InsertAsync(CNWRouteDTO dto);
    }

    public class CNWRoutesRepository : ICNWRoutesRepository
    {
        private readonly Func<IDbConnection> dbConnectionFactory;
        private static readonly string TABLE = "CNWRoutes";
        private static readonly string[] FIELDS = typeof(CNWRoute).DapperFields();
        private static readonly string[] DTOFIELDS = typeof(CNWRouteDTO).DapperFields();

        public CNWRoutesRepository(Func<IDbConnection> dbConnectionFactory)
        {
            this.dbConnectionFactory = dbConnectionFactory ?? throw new ArgumentNullException(nameof(dbConnectionFactory));
        }

        public async Task<IEnumerable<CNWRoute>> GetAllAsync(int? weekNo = null)
        {
            string sqlText = $@"
                SELECT 
                    r.Id,
                    r.WeekNo,
                    r.RouteDate,
                    r.Mileage,
                    r.ExtraMileage,
                    r.MPG,
                    r.Drops,
                    r.ExtraDrops,
                    r.Info,
                    r.RouteTypeId,
                    c.Name AS RouteType
                FROM {TABLE} r 
                INNER JOIN Categories c 
                    ON c.Id = r.RouteTypeId";

            using (var sql = dbConnectionFactory())
            {
                var routes =  (await sql.QueryAsync<CNWRoute>(sqlText));

                if (weekNo != null)
                {
                    routes = routes.Where(x => x.WeekNo == weekNo);
                }

                return routes.ToArray();
            }
        }

        public async Task<CNWRoute> GetAsync(int Id)
        {
            using (var sql = dbConnectionFactory())
            {
                return (await sql.QueryAsync<CNWRoute>($@"{DapperHelper.SELECT(TABLE, FIELDS)}")).SingleOrDefault(x => x.Id == Id);
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
