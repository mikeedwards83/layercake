
using Microsoft.AspNetCore.Authentication.JwtBearer;
using LayerCake.Kernel.Firebase.Authentication;
using LayerCake.Kernel.Firebase;
using LayerCake.Kernel.Firebase.Stores;
using LayerCake.Kernel.Tenants;
using FluentValidation;
using FluentValidation.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Add FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Configure CORS to allow the frontend to make requests
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
                "http://localhost:5001",      // Vite dev server (HTTP)
                "http://localhost:5002",  
                "https://localhost:5001",     // Vite dev server (HTTPS)
                "http://localhost:3000",      // Alternative frontend port
                "https://localhost:7002"     // Backend HTTPS (for same-origin scenarios)
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
builder.Services.AddFirebase(builder.Environment.IsDevelopment());
builder.Services.AddTenantStores();
builder.Services.AddFirestoreStores();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseFirebase();
app.UseHttpsRedirection();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
