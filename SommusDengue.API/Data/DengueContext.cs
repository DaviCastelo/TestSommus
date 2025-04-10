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
            modelBuilder.Entity<DengueAlert>()
                .HasKey(d => new { d.SemanaEpidemiologica, d.DataIniSETimestamp });

            modelBuilder.Entity<DengueAlert>()
                .Property(d => d.CasosEstimados)
                .HasPrecision(10, 2);

            modelBuilder.Entity<DengueAlert>()
                .Property(d => d.ProbabilidadeRt1)
                .HasPrecision(10, 8);

            modelBuilder.Entity<DengueAlert>()
                .Property(d => d.IncidenciaPor100k)
                .HasPrecision(10, 6);

            modelBuilder.Entity<DengueAlert>()
                .Property(d => d.NumeroReprodutivoEfetivo)
                .HasPrecision(10, 8);

            modelBuilder.Entity<DengueAlert>()
                .Property(d => d.DataInicioSE)
                .HasComputedColumnSql("FROM_UNIXTIME(DataIniSETimestamp / 1000)");

            base.OnModelCreating(modelBuilder);
        }
    }
} 