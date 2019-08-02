using MyFinances.Enums;
using MyFinances.Model;
using MyFinances.Repository;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyFinances.Service
{
    public interface IBaseService
    {
        Task UpdateAsync<T>(string field, T value, int id, string table) where T : class;
        Task DeleteAsync(int id, string table);
        Task<IEnumerable<Category>> GetAllCategories(CategoryType typeId);
    }

    public class BaseService : IBaseService
    {
        private readonly IBaseRepository baseRepository;
        private readonly ICategoryRepository categoryRepository;

        public BaseService(IBaseRepository baseRepository, ICategoryRepository categoryRepository)
        {
            this.baseRepository = baseRepository ?? throw new ArgumentNullException(nameof(baseRepository));
            this.categoryRepository = categoryRepository ?? throw new ArgumentNullException(nameof(categoryRepository));
        }

        public async Task UpdateAsync<T>(string field, T value, int id, string table) where T : class
        {
            await baseRepository.UpdateAsync(field, value, id, table);
        }

        public async Task DeleteAsync(int id, string table)
        {
            await baseRepository.DeleteAsync(id, table);
        }

        public async Task<IEnumerable<Category>> GetAllCategories(CategoryType typeId)
        {
            return await categoryRepository.GetAllAsync(typeId);
        }
    }
}
