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
    public interface IRemindersRepository
    {
        Task<IEnumerable<Reminder>> GetAllAsync();
        Task InsertAsync(ReminderDTO dto);
        Task HideAsync(int Id);
        Task<bool> ReminderExists(string notes);
    }

    public class RemindersRepository : IRemindersRepository
    {
        private readonly Func<IDbConnection> dbConnectionFactory;
        private static readonly string TABLE = "Reminders";
        private static readonly string[] FIELDS = typeof(Reminder).DapperFields();
        private static readonly string[] DTOFIELDS = typeof(ReminderDTO).DapperFields();

        public RemindersRepository(Func<IDbConnection> dbConnectionFactory)
        {
            this.dbConnectionFactory = dbConnectionFactory ?? throw new ArgumentNullException(nameof(dbConnectionFactory));
        }

        public async Task<IEnumerable<Reminder>> GetAllAsync()
        {
            using (var sql = dbConnectionFactory())
            {
                return (await sql.QueryAsync<Reminder>($"{DapperHelper.SELECT(TABLE, FIELDS)}")).ToArray();
            }
        }

        public async Task<bool> ReminderExists(string notes)
        {
            using (var sql = dbConnectionFactory())
            {
                var exists = await sql.QueryAsync<bool>($"SELECT 1 WHERE EXISTS (SELECT 1 FROM {TABLE} WHERE PATINDEX(@Notes, [Notes]) <> 0)", new { Notes = notes });
                return exists.Any();
            }
        }

        public async Task InsertAsync(ReminderDTO dto)
        {
            using (var sql = dbConnectionFactory())
            {
                await sql.ExecuteAsync($"{DapperHelper.INSERT(TABLE, DTOFIELDS)}", dto);
            }
        }

        public async Task HideAsync(int Id)
        {
            using (var sql = dbConnectionFactory())
            {
                await sql.ExecuteAsync($"UPDATE {TABLE} SET Display = 0 WHERE Id = @Id", new { Id });
            }
        }
    }
}
