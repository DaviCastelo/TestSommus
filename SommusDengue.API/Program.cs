using Microsoft.EntityFrameworkCore;
using SommusDengue.API.Data;
using SommusDengue.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
        builder.SetIsOriginAllowed(_ => true) // Permite qualquer origem em desenvolvimento
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials());
});

// Configure HttpClient
builder.Services.AddHttpClient<IAlertaDengueService, AlertaDengueService>();

// Configure Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<DengueContext>(options =>
{
    options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString),
        mySqlOptions => mySqlOptions.EnableRetryOnFailure()
    );
});

// Register Services
builder.Services.AddScoped<IAlertaDengueService, AlertaDengueService>();
builder.Services.AddScoped<IDengueRepository, DengueRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Use CORS before routing and authorization
app.UseCors();

app.UseAuthorization();

app.MapControllers();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<DengueContext>();
    context.Database.EnsureCreated();
}

app.Run();
