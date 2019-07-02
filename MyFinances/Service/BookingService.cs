using Ninject;
using MyFinances.Model;
using MyFinances.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyFinances.Service
{
    public interface IFinanceservice
    {
        Task<IEnumerable<Finances>> GetAllAsync();
    }

    public class Financeservice : IFinanceservice
    {
        private readonly IFinancesRepository FinancesRepository;

        public Financeservice(IFinancesRepository FinancesRepository)
        {
            this.FinancesRepository = FinancesRepository ?? throw new ArgumentNullException(nameof(FinancesRepository));
        }

        public async Task<IEnumerable<Finances>> GetAllAsync()
        {
            return await FinancesRepository.GetAllAsync();
        }
    }
}
