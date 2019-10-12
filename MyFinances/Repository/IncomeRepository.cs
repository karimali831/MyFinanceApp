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
                        c1.Name AS Source,
                        c2.Name AS SecondSource
                    FROM {TABLE} i
                    INNER JOIN Categories c1
                        ON c1.Id = i.SourceId
                    LEFT JOIN Categories c2
                        ON c2.Id = i.SecondSourceId
                    {(dateFilter.Frequency.HasValue ? " WHERE " + Utils.FilterDateSql(dateFilter) : null)}";;

                return (await sql.QueryAsync<Income>(sqlTxt)).ToArray();
            }
        }

        public async Task<IEnumerable<IncomeSummaryDTO>> GetSummaryAsync(DateFilter dateFilter)
        {
            using (var sql = dbConnectionFactory())
            {
                string sqlTxt = $@"
                    SELECT 
	                    i.SourceId,
	                    c1.Name AS Source,
                        c2.Name AS SecondSource,
	                    SUM(i.Amount) as TotalIncome
                    FROM 
	                    Incomes as i
                    LEFT JOIN Categories c1
	                    ON c1.Id = i.SourceId
                    LEFT JOIN Categories c2
	                    ON c2.Id = i.SecondSourceId
                    WHERE 
                         {Utils.FilterDateSql(dateFilter)}
                    GROUP BY 
	                    i.SourceId, c1.Name, c2.Name
                    ORDER BY 
	                    TotalIncome DESC";


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
    }
}
