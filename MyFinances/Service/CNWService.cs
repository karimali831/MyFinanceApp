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
    public interface ICNWService
    {
        Task<IEnumerable<CNWRoute>> GetAllAsync();
        Task InsertAsync(CNWRouteDTO dto);
    }

    public class CNWService : ICNWService
    {
        private readonly ICNWRepository cnwRepository;

        public CNWService(ICNWRepository cnwRepository)
        {
            this.cnwRepository = cnwRepository ?? throw new ArgumentNullException(nameof(CNWRepository));
        }

        public async Task<IEnumerable<CNWRoute>> GetAllAsync()
        {
            return await cnwRepository.GetAllAsync();
        }

        public async Task InsertAsync(CNWRouteDTO dto)
        {
            await cnwRepository.InsertAsync(dto);
        }
    }
}
