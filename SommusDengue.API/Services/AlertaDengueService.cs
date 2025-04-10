using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using SommusDengue.API.Models;

namespace SommusDengue.API.Services
{
    public class AlertaDengueService : IAlertaDengueService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<AlertaDengueService> _logger;
        private const string BaseUrl = "https://info.dengue.mat.br/api/alertcity";
        private const string GeocodeBH = "3106200";

        public AlertaDengueService(HttpClient httpClient, ILogger<AlertaDengueService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<IEnumerable<DengueAlert>> GetDengueAlerts(int startWeek, int endWeek, int startYear, int endYear)
        {
            try
            {
                var url = $"{BaseUrl}?geocode={GeocodeBH}&disease=dengue&format=json&ew_start={startWeek}&ew_end={endWeek}&ey_start={startYear}&ey_end={endYear}";
                _logger.LogInformation($"Requesting data from: {url}");

                var response = await _httpClient.GetAsync(url);
                var content = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"API request failed with status {response.StatusCode}. Response: {content}");
                    throw new HttpRequestException($"API request failed with status {response.StatusCode}");
                }

                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                var alerts = JsonSerializer.Deserialize<IEnumerable<DengueAlert>>(content, options);
                return alerts ?? Enumerable.Empty<DengueAlert>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching dengue alerts");
                throw;
            }
        }

        public async Task<IEnumerable<DengueAlert>> GetLastSixMonthsAlerts()
        {
            try
            {
                var today = DateTime.Today;
                var sixMonthsAgo = today.AddMonths(-6);
                
                var currentWeek = GetEpidemiologicalWeek(today);
                var startWeek = GetEpidemiologicalWeek(sixMonthsAgo);

                return await GetDengueAlerts(startWeek, currentWeek, sixMonthsAgo.Year, today.Year);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting last six months alerts");
                throw;
            }
        }

        public async Task<DengueAlert?> GetAlertByWeekAndYear(int week, int year)
        {
            try
            {
                var alerts = await GetDengueAlerts(week, week, year, year);
                return alerts.FirstOrDefault();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting alert for week {week} and year {year}");
                throw;
            }
        }

        private int GetEpidemiologicalWeek(DateTime date)
        {
            return (date.DayOfYear / 7) + 1;
        }
    }
} 