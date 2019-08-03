﻿using Dapper;
using DFM.Utils;
using MyFinances.DTOs;
using MyFinances.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MyFinances.Repository
{
    public interface ISpendingRepository
    {
        Task<IEnumerable<Spending>> GetAllAsync();
        Task InsertAsync(SpendingDTO dto);
    }

    public class SpendingRepository : ISpendingRepository
    {
        private readonly Func<IDbConnection> dbConnectionFactory;
        private static readonly string TABLE = "Spendings";
        private static readonly string[] DTOFIELDS = typeof(SpendingDTO).DapperFields();

        public SpendingRepository(Func<IDbConnection> dbConnectionFactory)
        {
            this.dbConnectionFactory = dbConnectionFactory ?? throw new ArgumentNullException(nameof(dbConnectionFactory));
        }

        public async Task<IEnumerable<Spending>> GetAllAsync()
        {
            string sqlTxt =
                $@"SELECT 
                    s.Id,
                    s.Name,
                    s.Amount,
                    s.Date,
                    s.Info,
                    c.Name AS Category
                FROM {TABLE} s 
                INNER JOIN Categories c 
                    ON c.Id = s.CatId
                WHERE 
                    Display = 1";

            using (var sql = dbConnectionFactory())
            {
                return (await sql.QueryAsync<Spending>(sqlTxt)).ToArray();
            }
        }

        public async Task InsertAsync(SpendingDTO dto)
        {
            using (var sql = dbConnectionFactory())
            {
                await sql.ExecuteAsync($@"{DapperHelper.INSERT(TABLE, DTOFIELDS)}", dto);
            }
        }
    }
}
