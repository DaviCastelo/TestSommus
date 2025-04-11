using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SommusDengue.API.Data;

namespace SommusDengue.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DengueDataController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DengueDataController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDengueData()
        {
            try
            {
                var data = await _context.DengueAlerts
                    .OrderByDescending(d => d.DataIniSETimestamp)
                    .Take(50) // Get last 50 records
                    .Select(d => new
                    {
                        d.SemanaEpidemiologica,
                        DataInicioSE = DateTimeOffset.FromUnixTimeMilliseconds(d.DataIniSETimestamp).DateTime,
                        d.CasosEstimados,
                        d.CasosEstimadosMin,
                        d.CasosEstimadosMax,
                        d.CasosNotificados,
                        d.ProbabilidadeRt1,
                        d.IncidenciaPor100k,
                        d.NivelAlerta,
                        d.NumeroReprodutivoEfetivo,
                        d.Populacao,
                        d.Receptividade,
                        d.Transmissao,
                        d.NivelIncidencia,
                        d.NotificacoesAcumuladasAno
                    })
                    .ToListAsync();

                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
} 