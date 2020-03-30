using Dapper;
using DFM.Utils;
using MyFinances.DTOs;
using MyFinances.Enums;
using MyFinances.Helpers;
using MyFinances.Model;
using MyFinances.ViewModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MyFinances.Repository
{
    public interface ICNWPaymentsRepository
    {
        Task<IEnumerable<CNWPayment>> GetAllAsync(DateFilter dateFilter);
        Task<CNWPayment> GetAsync(int weekNo);
        Task InsertAsync(CNWPaymentDTO dto);
        Task DeleteAsync(int weekNo);
        Task<bool> WeekPaymentSummaryExists(int weekNo);
        Task<IEnumerable<MonthComparisonChartVM>> GetFuelInByMonthAsync(DateFilter dateFilter);
    }

    public class CNWPaymentsRepository : ICNWPaymentsRepository
    {
        private readonly Func<IDbConnection> dbConnectionFactory;
        private static readonly string TABLE = "CNWPayments";
        private static readonly string[] FIELDS = typeof(CNWPayment).DapperFields();
        private static readonly string[] DTOFIELDS = typeof(CNWPaymentDTO).DapperFields();

        public CNWPaymentsRepository(Func<IDbConnection> dbConnectionFactory)
        {
            this.dbConnectionFactory = dbConnectionFactory ?? throw new ArgumentNullException(nameof(dbConnectionFactory));
        }

        public async Task<IEnumerable<CNWPayment>> GetAllAsync(DateFilter dateFilter)
        {
            string sqlText = $@"
                {DapperHelper.SELECT(TABLE, FIELDS)} 
                {(dateFilter.Frequency.HasValue ? " WHERE " + Utils.FilterDateSql(dateFilter) : null)}
            ";

            using (var sql = dbConnectionFactory())
            {
                return (await sql.QueryAsync<CNWPayment>(sqlText)).ToArray();
            }
        }

        public async Task<CNWPayment> GetAsync(int weekNo)
        {
            using (var sql = dbConnectionFactory())
            {
                return (await sql.QueryAsync<CNWPayment>($"{DapperHelper.SELECT(TABLE, FIELDS)}")).SingleOrDefault(x => x.WeekNo == weekNo);
            }
        }

        public async Task InsertAsync(CNWPaymentDTO dto)
        {
            using (var sql = dbConnectionFactory())
            {
                await sql.ExecuteAsync($@"{DapperHelper.INSERT(TABLE, DTOFIELDS)}", dto);
            }
        }

        public async Task DeleteAsync(int weekNo)
        {
            using (var sql = dbConnectionFactory())
            {
                await sql.ExecuteAsync($@"{DapperHelper.DELETE(TABLE)} WHERE WeekNo = @WeekNo ", new { WeekNo = weekNo });
            }
        }

        public async Task<bool> WeekPaymentSummaryExists(int weekNo)
        {
            using (var sql = dbConnectionFactory())
            {
                return (await sql.ExecuteScalarAsync<bool>($@"
                    SELECT count(1) FROM {TABLE} WHERE WeekNo = @WeekNo", 
                    new { WeekNo = weekNo }
                ));
            }
        }

        public async Task<IEnumerable<MonthComparisonChartVM>> GetFuelInByMonthAsync(DateFilter dateFilter)
        {
            string sqlTxt = $@"
                SELECT 
	                CONVERT(CHAR(7), PayDate, 120) as YearMonth, 
	                DATENAME(month, PayDate) AS MonthName, SUM(ActualMiles) as 'Total',
                    'FuelIn' AS Category
                FROM 
                    {TABLE}
                WHERE 
                    {Utils.FilterDateSql(dateFilter)} 
                GROUP BY 
                    CONVERT(CHAR(7), PayDate, 120) , DATENAME(month, PayDate)
                ORDER BY 
                    YearMonth";

            using var sql = dbConnectionFactory();
            return (await sql.QueryAsync<MonthComparisonChartVM>(sqlTxt)).ToArray();
        }
    }
}
