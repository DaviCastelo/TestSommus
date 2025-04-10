using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SommusDengue.API.Data;
using SommusDengue.API.Models;
using SommusDengue.API.Services;

namespace SommusDengue.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DengueController : ControllerBase
    {
        private readonly IAlertaDengueService _alertaDengueService;
        private readonly IDengueRepository _repository;

        public DengueController(IAlertaDengueService alertaDengueService, IDengueRepository repository)
        {
            _alertaDengueService = alertaDengueService;
            _repository = repository;
        }

        [HttpGet("sync")]
        public async Task<IActionResult> SyncData()
        {
            var alerts = await _alertaDengueService.GetLastSixMonthsAlerts();
            await _repository.AddRangeAsync(alerts);
            await _repository.SaveChangesAsync();
            return Ok("Data synchronized successfully");
        }

        [HttpGet("week")]
        public async Task<ActionResult<DengueAlertResponse>> GetByWeek([FromQuery] int ew, [FromQuery] int ey)
        {
            var alert = await _repository.GetByWeekAndYearAsync(ew, ey);
            
            if (alert == null)
                return NotFound();

            return DengueAlertResponse.FromDengueAlert(alert);
        }

        [HttpGet("last-three-weeks")]
        public async Task<ActionResult<IEnumerable<DengueAlertResponse>>> GetLastThreeWeeks()
        {
            var alerts = await _repository.GetLastThreeWeeksAsync();
            var response = new List<DengueAlertResponse>();
            
            foreach (var alert in alerts)
            {
                response.Add(DengueAlertResponse.FromDengueAlert(alert));
            }

            return Ok(response);
        }
    }
} 