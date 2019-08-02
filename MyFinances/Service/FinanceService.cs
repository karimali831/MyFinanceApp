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
        Task InsertAsync(FinanceDTO dto);
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

        public async Task InsertAsync(FinanceDTO dto)
        {
            await financeRepository.InsertAsync(dto);
        }
    }
}
