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
    public interface IMonzoRepository
    {
        Task<Monzo> MonzoAccountSummary();
        Task InsertMonzoAccountSummary(Monzo accountSummary);
    }

    public class MonzoRepository : IMonzoRepository
    {
        private readonly Func<IDbConnection> dbConnectionFactory;
        private static readonly string TABLE = "MonzoAccount";
        private static readonly string[] FIELDS = typeof(Monzo).DapperFields();

        public MonzoRepository(Func<IDbConnection> dbConnectionFactory)
        {
            this.dbConnectionFactory = dbConnectionFactory ?? throw new ArgumentNullException(nameof(dbConnectionFactory));
        }

        public async Task InsertMonzoAccountSummary(Monzo accountSummary)
        {
            using (var sql = dbConnectionFactory())
            {
                static object entry(Monzo t) =>
                    new
                    {
                        balance = t.Balance,
                        savingsBalance = t.SavingsBalance,
                        sortCode = t.SortCode,
                        accountNo = t.AccountNo,
                        spentToday = t.SpentToday,
                        jsonTransactions = JsonConvert.SerializeObject(t.Transactions),
                        created = DateTime.UtcNow
                    };

                await sql.QueryAsync<Monzo>($@"
                DELETE FROM {TABLE}
                INSERT INTO {TABLE}(Balance, SavingsBalance, SortCode, AccountNo, SpentToday, JsonTransactions, Created) VALUES (@balance, @savingsBalance, @sortCode, @accountNo, @spentToday, @jsonTransactions, @created)",
                    entry(accountSummary));
            }
        }

        public async Task<Monzo> MonzoAccountSummary()
        {
            using (var sql = dbConnectionFactory())
            {
                return
                    (await sql.QueryAsync<Monzo>($"SELECT TOP 1 * FROM {TABLE} ORDER BY created DESC"))
                        .Select(x => new Monzo
                        {
                            Balance = x.Balance,
                            SavingsBalance = x.SavingsBalance,
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
