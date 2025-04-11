using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SommusDengue.API.Models;

namespace SommusDengue.API.Data
{
    public class DengueRepository : IDengueRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<DengueRepository> _logger;

        public DengueRepository(ApplicationDbContext context, ILogger<DengueRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<DengueAlert>> GetAllAsync()
        {
            try
            {
                _logger.LogInformation("Retrieving all dengue alerts");
                var alerts = await _context.DengueAlerts
                    .AsNoTracking()
                    .OrderByDescending(a => a.DataIniSETimestamp)
                    .ToListAsync();

                _logger.LogInformation($"Retrieved {alerts.Count} alerts");
                return alerts;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all dengue alerts");
                throw;
            }
        }

        public async Task<DengueAlert?> GetByWeekAndYearAsync(int week, int year)
        {
            try
            {
                _logger.LogInformation($"Getting alert for week {week} and year {year}");
                var alert = await _context.DengueAlerts
                    .AsNoTracking()
                    .FirstOrDefaultAsync(a => a.SemanaEpidemiologica == week && 
                        DateTimeOffset.FromUnixTimeMilliseconds(a.DataIniSETimestamp).Year == year);
                
                if (alert == null)
                {
                    _logger.LogWarning($"No alert found for week {week} and year {year}");
                }
                else
                {
                    _logger.LogInformation($"Found alert: SE={alert.SemanaEpidemiologica}, " +
                        $"DataIniSETimestamp={alert.DataIniSETimestamp}");
                }
                
                return alert;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting alert for week {week} and year {year}");
                throw;
            }
        }

        public async Task<IEnumerable<DengueAlert>> GetLastThreeWeeksAsync()
        {
            try
            {
                _logger.LogInformation("Getting last three weeks of alerts");
                var alerts = await _context.DengueAlerts
                    .OrderByDescending(d => d.DataIniSETimestamp)
                    .Take(3)
                    .ToListAsync();
                _logger.LogInformation($"Retrieved {alerts.Count} alerts");
                return alerts;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting last three weeks of alerts");
                throw;
            }
        }

        public async Task AddRangeAsync(IEnumerable<DengueAlert> alerts)
        {
            try
            {
                _logger.LogInformation($"Starting to process {alerts.Count()} alerts");
                var existingAlerts = await _context.DengueAlerts.ToListAsync();
                _logger.LogInformation($"Found {existingAlerts.Count} existing alerts in database");

                foreach (var alert in alerts)
                {
                    _logger.LogInformation($"Processing alert: SE={alert.SemanaEpidemiologica}, " +
                        $"DataIniSETimestamp={alert.DataIniSETimestamp}");

                    var existingAlert = existingAlerts.FirstOrDefault(a => 
                        a.SemanaEpidemiologica == alert.SemanaEpidemiologica && 
                        a.DataIniSETimestamp == alert.DataIniSETimestamp);

                    if (existingAlert != null)
                    {
                        _logger.LogInformation($"Updating existing alert: SE={alert.SemanaEpidemiologica}");
                        existingAlert.CasosEstimados = alert.CasosEstimados;
                        existingAlert.CasosEstimadosMin = alert.CasosEstimadosMin;
                        existingAlert.CasosEstimadosMax = alert.CasosEstimadosMax;
                        existingAlert.CasosNotificados = alert.CasosNotificados;
                        existingAlert.ProbabilidadeRt1 = alert.ProbabilidadeRt1;
                        existingAlert.IncidenciaPor100k = alert.IncidenciaPor100k;
                        existingAlert.NivelAlerta = alert.NivelAlerta;
                        existingAlert.NumeroReprodutivoEfetivo = alert.NumeroReprodutivoEfetivo;
                        existingAlert.Populacao = alert.Populacao;
                        existingAlert.Receptividade = alert.Receptividade;
                        existingAlert.Transmissao = alert.Transmissao;
                        existingAlert.NivelIncidencia = alert.NivelIncidencia;
                        existingAlert.NotificacoesAcumuladasAno = alert.NotificacoesAcumuladasAno;
                    }
                    else
                    {
                        _logger.LogInformation($"Adding new alert: SE={alert.SemanaEpidemiologica}");
                        _context.DengueAlerts.Add(alert);
                    }
                }

                _logger.LogInformation("Finished processing alerts");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing alerts");
                throw;
            }
        }

        public async Task SaveChangesAsync()
        {
            try
            {
                _logger.LogInformation("Saving changes to database");
                await _context.SaveChangesAsync();
                _logger.LogInformation("Changes saved successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving changes to database");
                throw;
            }
        }
    }
} 