using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SommusDengue.API.Models;

namespace SommusDengue.API.Data
{
    public class DengueRepository : IDengueRepository
    {
        private readonly DengueContext _context;

        public DengueRepository(DengueContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DengueAlert>> GetAllAsync()
        {
            return await _context.DengueAlerts.ToListAsync();
        }

        public async Task<DengueAlert?> GetByWeekAndYearAsync(int week, int year)
        {
            return await _context.DengueAlerts
                .FirstOrDefaultAsync(d => d.SemanaEpidemiologica == week && d.DataInicioSE.Year == year);
        }

        public async Task<IEnumerable<DengueAlert>> GetLastThreeWeeksAsync()
        {
            return await _context.DengueAlerts
                .OrderByDescending(d => d.DataIniSETimestamp)
                .Take(3)
                .ToListAsync();
        }

        public async Task AddRangeAsync(IEnumerable<DengueAlert> alerts)
        {
            foreach (var alert in alerts)
            {
                alert.DataInicioSE = DateTimeOffset.FromUnixTimeMilliseconds(alert.DataIniSETimestamp).DateTime;
            }
            await _context.DengueAlerts.AddRangeAsync(alerts);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
} 