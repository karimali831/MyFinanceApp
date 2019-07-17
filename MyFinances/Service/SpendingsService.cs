using MyFinances.Model;
using MyFinances.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyFinances.Service
{
    public interface ISpendingService
    {
        Task<IEnumerable<Spending>> GetAllAsync();
        Task<IEnumerable<Category>> GetAllCategories();
        Task InsertAsync(string name, int catId, decimal amount);
        Task UpdateAsync<T>(string field, T value, int id) where T : class;
        Task DeleteAsync(int id);
        decimal GetTotalSpent(IEnumerable<Spending> spendings, int daysInterval);
    }

    public class SpendingService : ISpendingService
    {
        private readonly ISpendingRepository spendingRepository;
        private readonly ICategoryRepository categoryRepository;

        public SpendingService(ISpendingRepository spendingRepository, ICategoryRepository categoryRepository)
        {
            this.spendingRepository = spendingRepository ?? throw new ArgumentNullException(nameof(spendingRepository));
            this.categoryRepository = categoryRepository ?? throw new ArgumentNullException(nameof(categoryRepository));
        }

        public async Task<IEnumerable<Category>> GetAllCategories()
        {
            return await categoryRepository.GetAllAsync();
        }

        public async Task<IEnumerable<Spending>> GetAllAsync()
        {
            return await spendingRepository.GetAllAsync();
        }

        public async Task InsertAsync(string name, int catId, decimal amount)
        {
            await spendingRepository.InsertAsync(name, catId, amount);
        }

        public async Task UpdateAsync<T>(string field, T value, int id) where T : class
        {
            await spendingRepository.UpdateAsync(field, value, id);
        }

        public async Task DeleteAsync(int id)
        {
            await spendingRepository.DeleteAsync(id);
        }

        public decimal GetTotalSpent(IEnumerable<Spending> spendings, int daysInterval) 
        {
            return spendings.Where(x => x.Date >= DateTime.Now.Date.AddDays(daysInterval)).Sum(x => x.Amount);
        }
    }
}
