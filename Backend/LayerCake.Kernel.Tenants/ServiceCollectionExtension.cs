using FluentValidation;
using LayerCake.Kernel.Tenants.Projects;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace LayerCake.Kernel.Tenants;

public static class ServiceCollectionExtension
{
    public static void AddTenantStores(this IServiceCollection services)
    {
        services.AddTransient<IProjectsStore, ProjectsStore>();
        services.AddSingleton<ITenantContext, FakeTenantContext>();

        AddValidators(services);
    }

    private static void AddValidators(this IServiceCollection services)
    {
        // Scan and register all AbstractValidator implementations as transients
        var assembly = typeof(ServiceCollectionExtension).Assembly;
        var validatorType = typeof(IValidator);

        var validatorTypes = assembly.GetTypes()
            .Where(type => type.IsClass && !type.IsAbstract && validatorType.IsAssignableFrom(type));

        foreach (var type in validatorTypes)
        {
            services.AddTransient(type);
        }
    }
}