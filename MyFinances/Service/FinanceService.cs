using MyFinances.DTOs;
using MyFinances.Enums;
using MyFinances.Model;
using MyFinances.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyFinances.Service
{
    public interface IFinanceService
    {
        Task<IEnumerable<Finance>> GetAllAsync();
        Task<IEnumerable<Income>> GetAllIncomesAsync();
        Task InsertAsync(FinanceDTO dto);
        Task InsertIncomeAsync(IncomeDTO dto);
        decimal GetTotalIncome(IEnumerable<Income> incomes, int monthsInterval, Categories? sourceId = null, Categories? secondSourceId = null);
    }

    public class FinanceService : IFinanceService
    {
        private readonly IFinanceRepository financeRepository;
        private readonly IIncomeRepository incomeRepository;

        public FinanceService(IFinanceRepository financeRepository, IIncomeRepository incomeRepository)
        {
            this.financeRepository = financeRepository ?? throw new ArgumentNullException(nameof(financeRepository));
            this.incomeRepository = incomeRepository ?? throw new ArgumentNullException(nameof(incomeRepository));
        }

        public async Task<IEnumerable<Finance>> GetAllAsync()
        {
            return await financeRepository.GetAllAsync();
        }

        public async Task<IEnumerable<Income>> GetAllIncomesAsync()
        {
            return await incomeRepository.GetAllAsync();
        }

        public decimal GetTotalIncome(IEnumerable<Income> incomes, int monthsInterval, Categories? sourceId, Categories? secondSourceId)
        {
            var getIncomes = incomes.Where(x => x.Date >= DateTime.Now.Date.AddMonths(monthsInterval));

            if (sourceId.HasValue)
            {
                getIncomes = getIncomes.Where(x => (Categories)x.SourceId == sourceId);
            }

            if (secondSourceId.HasValue)
            {
                getIncomes = getIncomes.Where(x => (Categories)x.SecondSourceId == secondSourceId);
            }

            return getIncomes.Sum(x => x.Amount);
        }

        public async Task InsertAsync(FinanceDTO dto)
        {
            await financeRepository.InsertAsync(dto);
        }

        public async Task InsertIncomeAsync(IncomeDTO dto)
        {
            await incomeRepository.InsertAsync(dto);
        }
    }
}
