using MyFinances.Model;
using MyFinances.Repository;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyFinances.Service
{
    public interface IFinanceService
    {
        Task<IEnumerable<Finance>> GetAllAsync();
        Task InsertAsync(string name);
        Task UpdateAsync<T>(string field, T value, int id) where T : class;
        Task DeleteAsync(int id);
    }

    public class FinanceService : IFinanceService
    {
        private readonly IFinanceRepository financeRepository;

        public FinanceService(IFinanceRepository financeRepository)
        {
            this.financeRepository = financeRepository ?? throw new ArgumentNullException(nameof(financeRepository));
        }

        public async Task<IEnumerable<Finance>> GetAllAsync()
        {
            return await financeRepository.GetAllAsync();
        }

        public async Task InsertAsync(string name)
        {
            await financeRepository.InsertAsync(name);
        }

        public async Task UpdateAsync<T>(string field, T value, int id) where T : class
        {
            await financeRepository.UpdateAsync(field, value, id);
        }

        public async Task DeleteAsync(int id)
        {
            await financeRepository.DeleteAsync(id);
        }
    }
}
