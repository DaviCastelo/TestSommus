using Microsoft.EntityFrameworkCore;
using SommusDengue.API.Models;

namespace SommusDengue.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<DengueAlert> DengueAlerts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<DengueAlert>(entity =>
            {
                entity.ToTable("denguealerts");
                entity.HasKey(e => e.Id);
                
                // Configure unique index
                entity.HasIndex(e => new { e.SemanaEpidemiologica, e.DataIniSETimestamp })
                    .IsUnique();

                // Configure required fields
                entity.Property(e => e.SemanaEpidemiologica)
                    .IsRequired();
                entity.Property(e => e.DataIniSETimestamp)
                    .IsRequired();
                entity.Property(e => e.CasosEstimados)
                    .IsRequired();
                entity.Property(e => e.CasosEstimadosMin)
                    .IsRequired();
                entity.Property(e => e.CasosEstimadosMax)
                    .IsRequired();
                entity.Property(e => e.CasosNotificados)
                    .IsRequired();
                entity.Property(e => e.ProbabilidadeRt1)
                    .IsRequired();
                entity.Property(e => e.IncidenciaPor100k)
                    .IsRequired();
                entity.Property(e => e.NivelAlerta)
                    .IsRequired();
                entity.Property(e => e.NumeroReprodutivoEfetivo)
                    .IsRequired();
                entity.Property(e => e.Populacao)
                    .IsRequired();
                entity.Property(e => e.Receptividade)
                    .IsRequired();
                entity.Property(e => e.Transmissao)
                    .IsRequired();
                entity.Property(e => e.NivelIncidencia)
                    .IsRequired();
                entity.Property(e => e.NotificacoesAcumuladasAno)
                    .IsRequired();

                // Configure computed column for DataInicioSE
                entity.Property<DateTime>("DataInicioSE")
                    .HasComputedColumnSql("FROM_UNIXTIME(`DataIniSETimestamp` / 1000)", stored: true);
            });
        }
    }
} 