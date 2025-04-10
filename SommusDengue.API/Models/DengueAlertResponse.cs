using System.Text.Json.Serialization;

namespace SommusDengue.API.Models
{
    public class DengueAlertResponse
    {
        [JsonPropertyName("semana_epidemiologica")]
        public string SemanaEpidemiologica { get; set; } = string.Empty;

        [JsonPropertyName("casos_est")]
        public double CasosEstimados { get; set; }

        [JsonPropertyName("casos_notificados")]
        public int CasosNotificados { get; set; }

        [JsonPropertyName("nivel_alerta")]
        public int NivelAlerta { get; set; }

        public static DengueAlertResponse FromDengueAlert(DengueAlert alert)
        {
            return new DengueAlertResponse
            {
                SemanaEpidemiologica = alert.SemanaEpidemiologicaFormatada,
                CasosEstimados = alert.CasosEstimados,
                CasosNotificados = alert.CasosNotificados,
                NivelAlerta = alert.NivelAlerta
            };
        }
    }
} 