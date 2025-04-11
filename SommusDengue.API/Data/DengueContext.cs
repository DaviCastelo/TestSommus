using Microsoft.EntityFrameworkCore;
using SommusDengue.API.Models;

namespace SommusDengue.API.Data
{
    public class DengueContext : DbContext
    {
        public DengueContext(DbContextOptions<DengueContext> options) : base(options)
        {
        }

        public DbSet<DengueAlert> DengueAlerts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DengueAlert>(entity =>
            {
                entity.ToTable("denguealerts");
                entity.HasKey(e => e.Id);

                // Configure decimal precision for numeric fields
                entity.Property(e => e.CasosEstimados)
                    .HasPrecision(10, 2);

                entity.Property(e => e.CasosEstimadosMin)
                    .HasPrecision(10, 2);

                entity.Property(e => e.CasosEstimadosMax)
                    .HasPrecision(10, 2);

                entity.Property(e => e.ProbabilidadeRt1)
                    .HasPrecision(10, 8);

                entity.Property(e => e.IncidenciaPor100k)
                    .HasPrecision(10, 6);

                entity.Property(e => e.NumeroReprodutivoEfetivo)
                    .HasPrecision(10, 8);

                // Configure unique index
                entity.HasIndex(e => new { e.SemanaEpidemiologica, e.DataIniSETimestamp })
                    .IsUnique();

                // Explicitly ignore computed properties
                entity.Ignore(e => e.DataIniSE);
                entity.Ignore(e => e.SemanaEpidemiologicaFormatada);
            });

            base.OnModelCreating(modelBuilder);
        }
    }
} 