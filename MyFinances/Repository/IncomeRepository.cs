using Dapper;
using DFM.Utils;
using MyFinances.DTOs;
using MyFinances.Enums;
using MyFinances.Helpers;
using MyFinances.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MyFinances.Repository
{
    public interface IIncomeRepository
    {
        Task<IEnumerable<Income>> GetAllAsync(DateFilter filter);
        Task<IEnumerable<IncomeSummaryDTO>> GetSummaryAsync(DateFilter dateFilter);
        Task InsertAsync(IncomeDTO dto);
        Task<IEnumerable<(int Year, int Week)>> MissedIncomeEntriesAsync(string dateColumn, int weekArrears, Categories category);
    }

    public class IncomeRepository : IIncomeRepository
    {
        private readonly Func<IDbConnection> dbConnectionFactory;
        private static readonly string TABLE = "Incomes";
        private static readonly string[] FIELDS = typeof(Income).DapperFields();
        private static readonly string[] DTOFIELDS = typeof(IncomeDTO).DapperFields();

        public IncomeRepository(Func<IDbConnection> dbConnectionFactory)
        {
            this.dbConnectionFactory = dbConnectionFactory ?? throw new ArgumentNullException(nameof(dbConnectionFactory));
        }

        public async Task<IEnumerable<Income>> GetAllAsync(DateFilter dateFilter)
        {
            using (var sql = dbConnectionFactory())
            {
                string sqlTxt = $@"
                    SELECT 
                        i.Id,
                        i.Date,
                        i.Amount,
                        i.SourceId,
                        i.SecondSourceId,
                        i.WeekNo,
                        c1.Name AS Source,
                        c2.Name AS SecondSource
                    FROM {TABLE} i
                    INNER JOIN Categories c1
                        ON c1.Id = i.SourceId
                    LEFT JOIN Categories c2
                        ON c2.Id = i.SecondSourceId
                    {(dateFilter != null && dateFilter.Frequency.HasValue ? " WHERE " + Utils.FilterDateSql(dateFilter) : null)}";;

                return (await sql.QueryAsync<Income>(sqlTxt)).ToArray();
            }
        }

        public async Task<IEnumerable<IncomeSummaryDTO>> GetSummaryAsync(DateFilter dateFilter)
        {
            using (var sql = dbConnectionFactory())
            {
                string sqlTxt = $@"
                    SELECT 
	                    i.SourceId AS CatId,
						i.SecondSourceId AS SecondCatId,
	                    c1.Name AS Cat1,
                        c2.Name AS Cat2,
	                    SUM(i.Amount) as Total
                    FROM 
	                    {TABLE} as i
                    LEFT JOIN Categories c1
	                    ON c1.Id = i.SourceId
                    LEFT JOIN Categories c2
	                    ON c2.Id = i.SecondSourceId
                    WHERE 
                         {Utils.FilterDateSql(dateFilter)}
                    GROUP BY 
	                    i.SourceId, i.SecondSourceId, c1.Name, c2.Name
                    ORDER BY 
	                    Total DESC";


                    return (await sql.QueryAsync<IncomeSummaryDTO>(sqlTxt)).ToArray();
            }
        }

        public async Task InsertAsync(IncomeDTO dto)
        {
            using (var sql = dbConnectionFactory())
            {
                await sql.ExecuteAsync($@"{DapperHelper.INSERT(TABLE, DTOFIELDS)}", dto);
            }
        }

        public async Task<IEnumerable<(int Year, int Week)>> MissedIncomeEntriesAsync(string dateColumn, int weekArrears, Categories category)
        {
            string sqlTxt = $@"
                DECLARE @start DATE = '2019-08-07' -- since records began
                DECLARE @end DATE = DATEADD(WEEK, DATEDIFF(WEEK, -1, GETDATE())-@WeekArrears, -1) 

                ;WITH IntervalDates (date)
                AS
                (
                    SELECT @start
                    UNION ALL
                    SELECT DATEADD(WEEK, 1, date)
                    FROM IntervalDates
                    WHERE DATEADD(WEEK, 1, date)<=@end
                )
                SELECT YEAR(date) AS Year, DATEPART(wk, date) AS Week
                FROM IntervalDates

                EXCEPT

                SELECT DISTINCT YEAR({dateColumn}) AS yy, DATEPART(wk, {dateColumn}) AS ww
                FROM {TABLE}
                WHERE SourceId = @IncomeStream
            ";

            using (var sql = dbConnectionFactory())
            {
                return (await sql.QueryAsync<(int Year, int Week)>(sqlTxt, 
                    new {
                        @IncomeStream = (int)category,
                        @DateColumn = dateColumn,
                        @WeekArrears = weekArrears
                    }
                )).ToArray();

            }
        }
    }
}
