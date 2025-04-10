using System;
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
                
                var existingAlert = await _context.DengueAlerts
                    .FirstOrDefaultAsync(a => a.SemanaEpidemiologica == alert.SemanaEpidemiologica 
                                         && a.DataIniSETimestamp == alert.DataIniSETimestamp);

                if (existingAlert != null)
                {
                    // Update all properties except the key fields
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
                    
                    _context.DengueAlerts.Update(existingAlert);
                }
                else
                {
                    await _context.DengueAlerts.AddAsync(alert);
                }
            }
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
} 