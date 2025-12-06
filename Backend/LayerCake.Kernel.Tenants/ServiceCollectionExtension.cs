using LayerCake.Kernel.Tenants.Projects;
using Microsoft.Extensions.DependencyInjection;

namespace LayerCake.Kernel.Tenants;

public static class ServiceCollectionExtension
{

    public static void AddTenantStores(this IServiceCollection services)
    {
        services.AddTransient<ProjectsStore>();
    }
    
}