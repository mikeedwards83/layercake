
using Microsoft.AspNetCore.Authentication.JwtBearer;
using LayerCake.Kernel.Firebase.Authentication;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Configure CORS to allow the frontend to make requests
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",      // Vite dev server (HTTP)
                "https://localhost:5173",     // Vite dev server (HTTPS)
                "http://localhost:3000",      // Alternative frontend port
                "https://localhost:7131"      // Backend HTTPS (for same-origin scenarios)
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configure Firebase Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddScheme<JwtBearerOptions, FirebaseAuthenticationHandler>(
        JwtBearerDefaults.AuthenticationScheme,
        options => { });

builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
