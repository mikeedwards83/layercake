using LayerCake.Kernel.Firebase.Stores.Queries;
using LayerCake.Kernel.Store;
using LayerCake.Kernel.Tenants.Projects;
using Microsoft.Extensions.DependencyInjection;

namespace LayerCake.Kernel.Firebase.Stores;

public static class ServiceCollectionExtension
{
    public static void AddFirestoreStores(this IServiceCollection services)
    {
        services.AddTransient<IProjectsRepository, ProjectsRepository>();
        services.AddSingleton<IQueryFactory, QueryFactory>();
    }
}