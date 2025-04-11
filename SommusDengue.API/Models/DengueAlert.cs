using System;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SommusDengue.API.Models
{
    [Table("denguealerts")]
    public class DengueAlert
    {
        [Key]
        [Column("Id")]
        public long Id { get; set; }

        [Required]
        [Column("SemanaEpidemiologica")]
        [JsonPropertyName("SE")]
        public int SemanaEpidemiologica { get; set; }

        [Required]
        [Column("DataIniSETimestamp")]
        [JsonPropertyName("data_iniSE")]
        public long DataIniSETimestamp { get; set; }

        [Required]
        [Column("CasosEstimados", TypeName = "decimal(10,2)")]
        [JsonPropertyName("casos_est")]
        public decimal CasosEstimados { get; set; }

        [Required]
        [Column("CasosEstimadosMin", TypeName = "decimal(10,2)")]
        [JsonPropertyName("casos_est_min")]
        public decimal CasosEstimadosMin { get; set; }

        [Required]
        [Column("CasosEstimadosMax", TypeName = "decimal(10,2)")]
        [JsonPropertyName("casos_est_max")]
        public decimal CasosEstimadosMax { get; set; }

        [Required]
        [Column("CasosNotificados")]
        [JsonPropertyName("casos")]
        public int CasosNotificados { get; set; }

        [Required]
        [Column("ProbabilidadeRt1", TypeName = "decimal(10,2)")]
        [JsonPropertyName("p_rt1")]
        public decimal ProbabilidadeRt1 { get; set; }

        [Required]
        [Column("IncidenciaPor100k", TypeName = "decimal(10,2)")]
        [JsonPropertyName("p_inc100k")]
        public decimal IncidenciaPor100k { get; set; }

        [Required]
        [Column("NivelAlerta")]
        [JsonPropertyName("nivel")]
        public int NivelAlerta { get; set; }

        [Required]
        [Column("NumeroReprodutivoEfetivo", TypeName = "decimal(10,2)")]
        [JsonPropertyName("Rt")]
        public decimal NumeroReprodutivoEfetivo { get; set; }

        [Required]
        [Column("Populacao")]
        [JsonPropertyName("pop")]
        [JsonConverter(typeof(PopulacaoConverter))]
        public int Populacao { get; set; }

        [Required]
        [Column("Receptividade")]
        [JsonPropertyName("receptivo")]
        [JsonConverter(typeof(IntStatusConverter))]
        public int Receptividade { get; set; }

        [Required]
        [Column("Transmissao")]
        [JsonPropertyName("transmissao")]
        [JsonConverter(typeof(IntStatusConverter))]
        public int Transmissao { get; set; }

        [Required]
        [Column("NivelIncidencia")]
        [JsonPropertyName("nivel_inc")]
        [JsonConverter(typeof(IntStatusConverter))]
        public int NivelIncidencia { get; set; }

        [Required]
        [Column("NotificacoesAcumuladasAno")]
        [JsonPropertyName("notif_accum_year")]
        public int NotificacoesAcumuladasAno { get; set; }

        [NotMapped]
        public DateTime DataIniSE => DateTimeOffset.FromUnixTimeMilliseconds(DataIniSETimestamp).DateTime;

        [NotMapped]
        public string SemanaEpidemiologicaFormatada => $"{DataIniSE.Year}-{SemanaEpidemiologica:D2}";
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

    public class IntStatusConverter : JsonConverter<int>
    {
        public override int Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.String)
            {
                if (int.TryParse(reader.GetString(), out int value))
                {
                    return value;
                }
            }
            else if (reader.TokenType == JsonTokenType.Number)
            {
                return reader.GetInt32();
            }
            
            throw new JsonException("Unable to convert value to integer.");
        }

        public override void Write(Utf8JsonWriter writer, int value, JsonSerializerOptions options)
        {
            writer.WriteNumberValue(value);
        }
    }
} 