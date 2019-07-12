using MyFinances.DTOs;
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
        Task InsertAsync(FinanceDTO finance);
        Task DeleteAsync(int id);
    }

    public class FinanceService : IFinanceService
    {
        private readonly IFinanceRepository FinanceRepository;

        public FinanceService(IFinanceRepository FinanceRepository)
        {
            this.FinanceRepository = FinanceRepository ?? throw new ArgumentNullException(nameof(FinanceRepository));
        }

        public async Task<IEnumerable<Finance>> GetAllAsync()
        {
            return await FinanceRepository.GetAllAsync();
        }

        public async Task InsertAsync(FinanceDTO finance)
        {
            await FinanceRepository.InsertAsync(finance);
        }

        public async Task DeleteAsync(int id)
        {
            await FinanceRepository.DeleteAsync(id);
        }
    }
}
