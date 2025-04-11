using System;
using System.Text.Json.Serialization;

namespace SommusDengue.API.Models
{
    public class DengueAlertResponse
    {
        public long Id { get; set; }
        public int SemanaEpidemiologica { get; set; }
        public long DataIniSETimestamp { get; set; }
        public decimal CasosEstimados { get; set; }
        public decimal CasosEstimadosMin { get; set; }
        public decimal CasosEstimadosMax { get; set; }
        public int CasosNotificados { get; set; }
        public decimal ProbabilidadeRt1 { get; set; }
        public decimal IncidenciaPor100k { get; set; }
        public int NivelAlerta { get; set; }
        public decimal NumeroReprodutivoEfetivo { get; set; }
        public int Populacao { get; set; }
        public int Receptividade { get; set; }
        public int Transmissao { get; set; }
        public int NivelIncidencia { get; set; }
        public int NotificacoesAcumuladasAno { get; set; }

        [JsonIgnore]
        public DateTime DataIniSE => DateTimeOffset.FromUnixTimeMilliseconds(DataIniSETimestamp).DateTime;

        public string SemanaEpidemiologicaFormatada => $"{DataIniSE.Year}-{SemanaEpidemiologica:D2}";

        public static DengueAlertResponse? FromDengueAlert(DengueAlert alert)
        {
            if (alert == null)
                return null;

            return new DengueAlertResponse
            {
                Id = alert.Id,
                SemanaEpidemiologica = alert.SemanaEpidemiologica,
                DataIniSETimestamp = alert.DataIniSETimestamp,
                CasosEstimados = alert.CasosEstimados,
                CasosEstimadosMin = alert.CasosEstimadosMin,
                CasosEstimadosMax = alert.CasosEstimadosMax,
                CasosNotificados = alert.CasosNotificados,
                ProbabilidadeRt1 = alert.ProbabilidadeRt1,
                IncidenciaPor100k = alert.IncidenciaPor100k,
                NivelAlerta = alert.NivelAlerta,
                NumeroReprodutivoEfetivo = alert.NumeroReprodutivoEfetivo,
                Populacao = alert.Populacao,
                Receptividade = alert.Receptividade,
                Transmissao = alert.Transmissao,
                NivelIncidencia = alert.NivelIncidencia,
                NotificacoesAcumuladasAno = alert.NotificacoesAcumuladasAno
            };
        }
    }
} 