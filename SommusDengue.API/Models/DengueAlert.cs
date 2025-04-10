using System;
using System.Text.Json.Serialization;

namespace SommusDengue.API.Models
{
    public class DengueAlert
    {
        [JsonPropertyName("data_iniSE")]
        public long DataIniSETimestamp { get; set; }

        [JsonPropertyName("SE")]
        public int SemanaEpidemiologica { get; set; }

        [JsonPropertyName("casos_est")]
        public double CasosEstimados { get; set; }

        [JsonPropertyName("casos_est_min")]
        public int CasosEstimadosMin { get; set; }

        [JsonPropertyName("casos_est_max")]
        public int CasosEstimadosMax { get; set; }

        [JsonPropertyName("casos")]
        public int CasosNotificados { get; set; }

        [JsonPropertyName("p_rt1")]
        public double ProbabilidadeRt1 { get; set; }

        [JsonPropertyName("p_inc100k")]
        public double IncidenciaPor100k { get; set; }

        [JsonPropertyName("nivel")]
        public int NivelAlerta { get; set; }

        [JsonPropertyName("Rt")]
        public double NumeroReprodutivoEfetivo { get; set; }

        [JsonPropertyName("pop")]
        public double Populacao { get; set; }

        [JsonPropertyName("receptivo")]
        public int Receptividade { get; set; }

        [JsonPropertyName("transmissao")]
        public int Transmissao { get; set; }

        [JsonPropertyName("nivel_inc")]
        public int NivelIncidencia { get; set; }

        [JsonPropertyName("notif_accum_year")]
        public int NotificacoesAcumuladasAno { get; set; }

        public DateTime DataInicioSE { get; set; }
        
        public string SemanaEpidemiologicaFormatada => $"{DataInicioSE.Year}-{SemanaEpidemiologica.ToString().PadLeft(2, '0')}";
    }
} 