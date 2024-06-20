using Microsoft.EntityFrameworkCore;
using server.Data;
using DotNetEnv;

var builder = WebApplication.CreateBuilder(args);

// Load environment variables from .env file
Env.Load();

// Add configuration to the builder
builder.Configuration.AddEnvironmentVariables();
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

// Access configuration
var configuration = builder.Configuration;

// Initiaze Supabase & other variables
var url = builder.Configuration["SUPABASE_URL"] ?? string.Empty;
var key = builder.Configuration["SUPABASE_KEY"] ?? string.Empty;
var postgressConnectionString = builder.Configuration["SUPABASE_POSTGRES_CONNECTION_STRING"] ?? string.Empty;

if (string.IsNullOrEmpty(postgressConnectionString))
{
    throw new ArgumentNullException(nameof(postgressConnectionString), "Postgres connection string cannot be null or empty. Create .env file at root of directory with variable 'SUPABASE_POSTGRES_CONNECTION_STRING={connection_string}'.");
}

if (string.IsNullOrEmpty(url))
{
    throw new ArgumentNullException(nameof(url), "Supabase URL cannot be null or empty. Create .env file at root of directory with variable 'SUPABASE_URL={url}'.");
}

if (string.IsNullOrEmpty(key))
{
    throw new ArgumentNullException(nameof(key), "Supabase key cannot be null or empty. Create .env file at root of directory with variable 'SUPABASE_KEY={key}'.");
}

var options = new Supabase.SupabaseOptions
{
    AutoConnectRealtime = true
};

if (options == null)
{
    throw new ArgumentNullException(nameof(options), "Supabase options cannot be null.");
}

var supabase = new Supabase.Client(url, key, options);
await supabase.InitializeAsync();

// Add services to the container.
// Intializes database context
// builder.Services.AddDbContext<PostgresContext>(options =>
// {
//     options.UseNpgsql(postgressConnectionString);
// });
builder.Services.AddDbContext<PostgresContext>(options =>
    options.UseNpgsql(postgressConnectionString));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
