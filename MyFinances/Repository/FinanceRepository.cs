using Dapper;
using DFM.Utils;
using MyFinances.DTOs;
using MyFinances.Enums;
using MyFinances.Helpers;
using MyFinances.Model;
using MyFinances.Models;
using MyFinances.ViewModels;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MyFinances.Repository
{
    public interface IFinanceRepository
    {
        Task<Finance> GetAsync(int financeId);
        Task<IEnumerable<Finance>> GetAllAsync();
        Task InsertAsync(FinanceDTO dto);
        Task UpdateNextDueDateAsync(DateTime dueDate, int Id);
        Task<IEnumerable<MonthComparisonChartVM>> GetIncomeExpenseTotalsByMonth(DateFilter filter);
        Task<IEnumerable<MonthComparisonChartVM>> GetFinanceTotalsByMonth(MonthComparisonChartRequestDTO request);
        Task<Monzo> MonzoAccountSummary();
        Task InsertMonzoAccountSummary(Monzo accountSummary);
    }

    public class FinanceRepository : IFinanceRepository
    {
        private readonly Func<IDbConnection> dbConnectionFactory;
        private static readonly string TABLE = "Finances";
        private static readonly string[] FIELDS = typeof(Finance).DapperFields();
        private static readonly string[] DTOFIELDS = typeof(FinanceDTO).DapperFields();

        public FinanceRepository(Func<IDbConnection> dbConnectionFactory)
        {
            this.dbConnectionFactory = dbConnectionFactory ?? throw new ArgumentNullException(nameof(dbConnectionFactory));
        }

        public async Task<Finance> GetAsync(int financeId)
        {
            string sqlTxt = $"{DapperHelper.SELECT(TABLE, FIELDS)} WHERE Id = @Id";

            var sql = dbConnectionFactory();
            return (await sql.QueryAsync<Finance>(sqlTxt, new { Id = financeId })).FirstOrDefault();
        }

        public async Task<IEnumerable<Finance>> GetAllAsync()
        {
            using (var sql = dbConnectionFactory())
            {
                return (await sql.QueryAsync<Finance>($"{DapperHelper.SELECT(TABLE, FIELDS)}")).ToArray();
            }
        }

        public async Task UpdateNextDueDateAsync(DateTime dueDate, int Id)
        {
            using (var sql = dbConnectionFactory())
            {
                await sql.ExecuteAsync($@"
                    UPDATE {TABLE} SET NextDueDate = @DueDate WHERE Id = @Id", new { DueDate = dueDate, Id }
                );
            }
        }

        public async Task<IEnumerable<MonthComparisonChartVM>> GetIncomeExpenseTotalsByMonth(DateFilter filter)
        {
            string sqlTxt = $@"
                SELECT 
	                CONVERT(CHAR(7), Date, 120) as YearMonth, 
	                DATENAME(month, Date) AS MonthName, SUM(Amount) as 'Total', 
	                '{nameof(CategoryType.Spendings)}' as 'Type'
                FROM 
                    Spendings
                WHERE 
                    {Utils.FilterDateSql(filter)}
                GROUP BY 
                    CONVERT(CHAR(7), Date, 120) , DATENAME(month, Date)
                UNION
                SELECT
	                CONVERT(CHAR(7), Date, 120), 
	                DATENAME(month, Date), 
	                SUM(Amount), '{nameof(CategoryType.Income)}'
                FROM 
                    Incomes
                WHERE 
                    {Utils.FilterDateSql(filter)}
                GROUP BY 
                    CONVERT(CHAR(7), Date, 120) , DATENAME(month, Date)
                ORDER BY 
                    YearMonth";

            using (var sql = dbConnectionFactory())
            {
                return (await sql.QueryAsync<MonthComparisonChartVM>(sqlTxt)).ToArray();
            }
        }

        public async Task<IEnumerable<MonthComparisonChartVM>> GetFinanceTotalsByMonth(MonthComparisonChartRequestDTO request)
        {
            string sqlTxt = $@"
                SELECT 
	                CONVERT(CHAR(7), Date, 120) as YearMonth, 
	                DATENAME(month, Date) AS MonthName, SUM(Amount) as 'Total'
                FROM 
                    Spendings s
                INNER JOIN 
                    {TABLE} f 
                ON 
                    f.Id = s.FinanceId
                WHERE 
                    {Utils.FilterDateSql(request.DateFilter)}
                GROUP BY 
                    CONVERT(CHAR(7), Date, 120) , DATENAME(month, Date)
                ORDER BY 
                    YearMonth";

            using (var sql = dbConnectionFactory())
            {
                return (await sql.QueryAsync<MonthComparisonChartVM>(sqlTxt)).ToArray();
            }
        }

        public async Task InsertAsync(FinanceDTO dto)
        {
            using (var sql = dbConnectionFactory())
            {
                await sql.ExecuteAsync($@"{DapperHelper.INSERT(TABLE, DTOFIELDS)}", dto);
            }
        }

        public async Task InsertMonzoAccountSummary(Monzo accountSummary)
        {
            using (var sql = dbConnectionFactory())
            {
                static object entry(Monzo t) =>
                    new
                    {
                        balance = t.Balance,
                        sortCode = t.SortCode,
                        accountNo = t.AccountNo,
                        spentToday = t.SpentToday,
                        jsonTransactions = JsonConvert.SerializeObject(t.Transactions),
                        created = DateTime.UtcNow
                    };

                await sql.QueryAsync<Monzo>($@"
                INSERT INTO MonzoAccount(Balance, SortCode, AccountNo, SpentToday, JsonTransactions, Created) VALUES (@balance, @sortCode, @accountNo, @spentToday, @jsonTransactions, @created)",
                    entry(accountSummary));
            }
        }

        public async Task<Monzo> MonzoAccountSummary()
        {
            using (var sql = dbConnectionFactory())
            {
                return
                    (await sql.QueryAsync<Monzo>("SELECT TOP 1 * FROM MonzoAccount ORDER BY created DESC"))
                        .Select(x => new Monzo
                        {
                            Balance = x.Balance,
                            SortCode = x.SortCode,
                            AccountNo = x.AccountNo,
                            SpentToday = x.SpentToday,
                            Transactions = JsonConvert.DeserializeObject<IEnumerable<MonzoTransaction>>(x.JsonTransactions),
                            Created = x.Created
                        })
                        .FirstOrDefault();
            }
        }
    }
}
