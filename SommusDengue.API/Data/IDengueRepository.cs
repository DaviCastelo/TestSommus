using System.Collections.Generic;
using System.Threading.Tasks;
using SommusDengue.API.Models;

namespace SommusDengue.API.Data
{
    public interface IDengueRepository
    {
        Task<IEnumerable<DengueAlert>> GetAllAsync();
        Task<DengueAlert?> GetByWeekAndYearAsync(int week, int year);
        Task<IEnumerable<DengueAlert>> GetLastThreeWeeksAsync();
        Task AddRangeAsync(IEnumerable<DengueAlert> alerts);
        Task SaveChangesAsync();
    }
} 