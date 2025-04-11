using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SommusDengue.API.Data;
using SommusDengue.API.Models;
using SommusDengue.API.Services;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Text.Json;

namespace SommusDengue.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DengueController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IAlertaDengueService _alertaDengueService;
        private readonly IDengueRepository _repository;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<DengueController> _logger;

        public DengueController(
            ApplicationDbContext context,
            IAlertaDengueService alertaDengueService,
            IDengueRepository repository,
            IHttpClientFactory httpClientFactory,
            ILogger<DengueController> logger)
        {
            _context = context;
            _alertaDengueService = alertaDengueService;
            _repository = repository;
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DengueAlert>>> GetAll()
        {
            try
            {
                _logger.LogInformation("Retrieving all dengue alerts");
                var alerts = await _repository.GetAllAsync();
                
                if (!alerts.Any())
                {
                    _logger.LogWarning("No dengue alerts found in database");
                    return NotFound("No dengue alerts found");
                }

                _logger.LogInformation($"Retrieved {alerts.Count()} alerts successfully");
                return Ok(alerts.OrderByDescending(a => a.DataIniSETimestamp));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving dengue alerts");
                return StatusCode(500, new { error = "Error retrieving dengue alerts", details = ex.Message });
            }
        }

        [HttpGet("latest")]
        public async Task<ActionResult<IEnumerable<DengueAlert>>> GetLatest()
        {
            try
            {
                _logger.LogInformation("Retrieving latest dengue alerts");
                var alerts = await _repository.GetAllAsync();
                
                if (!alerts.Any())
                {
                    _logger.LogWarning("No dengue alerts found in database");
                    return NotFound("No dengue alerts found");
                }

                var latestAlerts = alerts
                    .OrderByDescending(a => a.DataIniSETimestamp)
                    .Take(3)
                    .ToList();

                _logger.LogInformation($"Retrieved {latestAlerts.Count} latest alerts successfully");
                return Ok(latestAlerts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving latest dengue alerts");
                return StatusCode(500, new { error = "Error retrieving latest dengue alerts", details = ex.Message });
            }
        }

        [HttpGet("{week}/{year}")]
        public async Task<ActionResult<DengueAlert>> GetByWeekAndYear(int week, int year)
        {
            try
            {
                _logger.LogInformation($"Getting alert for week {week} and year {year}");
                var alert = await _repository.GetByWeekAndYearAsync(week, year);
                
                if (alert == null)
                {
                    _logger.LogWarning($"No alert found for week {week} and year {year}");
                    return NotFound($"No dengue alert found for week {week} and year {year}");
                }

                _logger.LogInformation($"Found alert for week {week} and year {year}");
                return Ok(alert);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving dengue alert for week {week} and year {year}");
                return StatusCode(500, new { error = "Error retrieving dengue alert", details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DengueAlert alert)
        {
            _context.DengueAlerts.Add(alert);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetByWeekAndYear), 
                new { week = alert.SemanaEpidemiologica, 
                      year = DateTimeOffset.FromUnixTimeMilliseconds(alert.DataIniSETimestamp).Year }, 
                alert);
        }

        [HttpGet("sync")]
        public async Task<IActionResult> SyncData()
        {
            try
            {
                _logger.LogInformation("Starting dengue data sync");
                var client = _httpClientFactory.CreateClient("InfoDengue");
                var response = await client.GetAsync("api/alertcity?geocode=3106200&disease=dengue&format=json");

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"API request failed with status code: {response.StatusCode}");
                    return StatusCode((int)response.StatusCode, "Failed to fetch data from InfoDengue API");
                }

                var content = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("Received response from InfoDengue API");

                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    NumberHandling = System.Text.Json.Serialization.JsonNumberHandling.AllowReadingFromString
                };

                var alerts = JsonSerializer.Deserialize<List<DengueAlert>>(content, options);
                
                if (alerts == null || !alerts.Any())
                {
                    _logger.LogWarning("No alerts found in the API response");
                    return NotFound("No dengue alerts found in the API response");
                }

                _logger.LogInformation($"Processing {alerts.Count} alerts");
                await _repository.AddRangeAsync(alerts);
                await _repository.SaveChangesAsync();

                _logger.LogInformation("Dengue data sync completed successfully");
                return Ok(new { message = "Dengue data synchronized successfully", count = alerts.Count });
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Error deserializing API response");
                return BadRequest(new { error = "Error processing API response", details = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during dengue data sync");
                return StatusCode(500, new { error = "Internal server error", details = ex.Message });
            }
        }

        private (int Week, int Year) GetEpidemiologicalWeek(DateTime date)
        {
            // First day of the year
            var firstDay = new DateTime(date.Year, 1, 1);
            
            // First epidemiological week starts on the first Sunday of the year
            var firstSunday = firstDay.AddDays((7 - (int)firstDay.DayOfWeek) % 7);
            
            if (date < firstSunday)
            {
                // If date is before first Sunday, it belongs to the last week of previous year
                return (53, date.Year - 1);
            }
            
            var weekNumber = (int)Math.Ceiling((date - firstSunday).TotalDays / 7.0);
            return (weekNumber, date.Year);
        }

        [HttpGet("week")]
        public async Task<ActionResult<DengueAlertResponse>> GetByWeek([FromQuery] int ew, [FromQuery] int ey)
        {
            try
            {
                var alert = await _repository.GetByWeekAndYearAsync(ew, ey);
                
                if (alert == null)
                {
                    return NotFound($"No dengue alert found for week {ew} and year {ey}");
                }

                var response = DengueAlertResponse.FromDengueAlert(alert);
                if (response == null)
                {
                    return StatusCode(500, "Error creating response object");
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving dengue alert for week {ew} and year {ey}");
                return StatusCode(500, new { error = "Error retrieving dengue alert", details = ex.Message });
            }
        }

        [HttpGet("last-three-weeks")]
        public async Task<ActionResult<IEnumerable<DengueAlertResponse>>> GetLastThreeWeeks()
        {
            try
            {
                var alerts = await _repository.GetLastThreeWeeksAsync();
                var response = alerts.Select(alert => DengueAlertResponse.FromDengueAlert(alert))
                    .Where(response => response != null)
                    .ToList();

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving last three weeks of dengue alerts");
                return StatusCode(500, new { error = "Error retrieving dengue alerts", details = ex.Message });
            }
        }
    }
} 