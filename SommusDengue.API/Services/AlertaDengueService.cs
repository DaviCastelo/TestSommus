using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Text.Json.Serialization;
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
        private const string GeocodeBH = "3106200"; // Código IBGE de Belo Horizonte
        private readonly JsonSerializerOptions _jsonOptions;

        public AlertaDengueService(HttpClient httpClient, ILogger<AlertaDengueService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                NumberHandling = JsonNumberHandling.AllowReadingFromString | JsonNumberHandling.AllowNamedFloatingPointLiterals
            };
        }

        public async Task<IEnumerable<DengueAlert>> GetDengueAlerts(int startWeek, int endWeek, int startYear, int endYear)
        {
            ValidateWeekRange(startWeek, endWeek);
            ValidateYearRange(startYear, endYear);

            try
            {
                var url = $"{BaseUrl}?geocode={GeocodeBH}&disease=dengue&format=json&ew_start={startWeek}&ew_end={endWeek}&ey_start={startYear}&ey_end={endYear}";
                _logger.LogInformation($"Requesting data from: {url}");

                var response = await _httpClient.GetAsync(url);
                var content = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"API request failed with status {response.StatusCode}. Response: {content}");
                    
                    // Parse error message from API response
                    if (content.Contains("error_message"))
                    {
                        var error = JsonSerializer.Deserialize<ErrorResponse>(content, _jsonOptions);
                        throw new HttpRequestException($"API Error: {error?.ErrorMessage}");
                    }
                    
                    throw new HttpRequestException($"API request failed with status {response.StatusCode}");
                }

                _logger.LogInformation($"Received JSON content: {content}");

                var alerts = JsonSerializer.Deserialize<IEnumerable<DengueAlert>>(content, _jsonOptions);
                return alerts ?? Enumerable.Empty<DengueAlert>();
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Error deserializing API response");
                throw;
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
                
                var (currentWeek, currentYear) = GetEpidemiologicalWeekAndYear(today);
                var (startWeek, startYear) = GetEpidemiologicalWeekAndYear(sixMonthsAgo);

                // Se estivermos em um ano diferente, precisamos fazer duas chamadas
                if (startYear != currentYear)
                {
                    // Primeira chamada: do início até o final do ano anterior
                    var alerts1 = await GetDengueAlerts(startWeek, 53, startYear, startYear);
                    
                    // Segunda chamada: do início do ano atual até a semana atual
                    var alerts2 = await GetDengueAlerts(1, currentWeek, currentYear, currentYear);
                    
                    return alerts1.Concat(alerts2);
                }

                return await GetDengueAlerts(startWeek, currentWeek, startYear, currentYear);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting last six months alerts");
                throw;
            }
        }

        public async Task<DengueAlert?> GetAlertByWeekAndYear(int week, int year)
        {
            ValidateWeekRange(week, week);
            ValidateYearRange(year, year);

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

        private (int Week, int Year) GetEpidemiologicalWeekAndYear(DateTime date)
        {
            // First week of the year is the week that contains January 4th
            var jan4 = new DateTime(date.Year, 1, 4);
            var startOfFirstWeek = jan4.AddDays(-(int)jan4.DayOfWeek + 1);

            if (date < startOfFirstWeek)
            {
                // If date is before the first week, it belongs to the last week of previous year
                return GetEpidemiologicalWeekAndYear(date.AddDays(-7));
            }

            var weekNumber = (int)((date - startOfFirstWeek).TotalDays / 7) + 1;
            
            if (weekNumber > 53)
            {
                // If week number is greater than 53, it belongs to the first week of next year
                return (1, date.Year + 1);
            }

            return (weekNumber, date.Year);
        }

        private void ValidateWeekRange(int startWeek, int endWeek)
        {
            if (startWeek < 1 || startWeek > 53)
                throw new ArgumentOutOfRangeException(nameof(startWeek), "Week must be between 1 and 53");
            
            if (endWeek < 1 || endWeek > 53)
                throw new ArgumentOutOfRangeException(nameof(endWeek), "Week must be between 1 and 53");
            
            if (endWeek < startWeek)
                throw new ArgumentException("End week cannot be less than start week");
        }

        private void ValidateYearRange(int startYear, int endYear)
        {
            if (startYear < 2000 || startYear > 9999)
                throw new ArgumentOutOfRangeException(nameof(startYear), "Year must be between 2000 and 9999");
            
            if (endYear < 2000 || endYear > 9999)
                throw new ArgumentOutOfRangeException(nameof(endYear), "Year must be between 2000 and 9999");
            
            if (endYear < startYear)
                throw new ArgumentException("End year cannot be less than start year");
        }
    }

    public class ErrorResponse
    {
        [JsonPropertyName("error_message")]
        public string? ErrorMessage { get; set; }
    }
} 