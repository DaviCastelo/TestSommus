using System;
using System.Text.Json;
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
        public decimal CasosEstimados { get; set; }

        [JsonPropertyName("casos_est_min")]
        public decimal CasosEstimadosMin { get; set; }

        [JsonPropertyName("casos_est_max")]
        public decimal CasosEstimadosMax { get; set; }

        [JsonPropertyName("casos")]
        public int CasosNotificados { get; set; }

        [JsonPropertyName("p_rt1")]
        public decimal ProbabilidadeRt1 { get; set; }

        [JsonPropertyName("p_inc100k")]
        public decimal IncidenciaPor100k { get; set; }

        [JsonPropertyName("nivel")]
        public int NivelAlerta { get; set; }

        [JsonPropertyName("Rt")]
        public decimal NumeroReprodutivoEfetivo { get; set; }

        [JsonPropertyName("pop")]
        [JsonConverter(typeof(PopulacaoConverter))]
        public int Populacao { get; set; }

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

    public class PopulacaoConverter : JsonConverter<int>
    {
        public override int Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.String)
            {
                if (decimal.TryParse(reader.GetString(), out decimal value))
                {
                    return (int)Math.Round(value);
                }
            }
            else if (reader.TokenType == JsonTokenType.Number)
            {
                if (reader.TryGetDecimal(out decimal value))
                {
                    return (int)Math.Round(value);
                }
            }
            
            throw new JsonException("Unable to convert population value to integer.");
        }

        public override void Write(Utf8JsonWriter writer, int value, JsonSerializerOptions options)
        {
            writer.WriteNumberValue(value);
        }
    }
} 