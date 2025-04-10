using System.Collections.Generic;
using System.Threading.Tasks;
using SommusDengue.API.Models;

namespace SommusDengue.API.Services
{
    public interface IAlertaDengueService
    {
        Task<IEnumerable<DengueAlert>> GetDengueAlerts(int startWeek, int endWeek, int startYear, int endYear);
        Task<IEnumerable<DengueAlert>> GetLastSixMonthsAlerts();
        Task<DengueAlert?> GetAlertByWeekAndYear(int week, int year);
    }
} 