using LayerCake.Kernel.Firebase.Stores.Projects;
using LayerCake.Kernel.Firebase.Stores.Queries;
using LayerCake.Kernel.Store;
using LayerCake.Kernel.Tenants.Projects;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace LayerCake.Kernel.Firebase.Stores;

public static class ServiceCollectionExtension
{
    public static void AddFirestoreStores(this IServiceCollection services)
    {
        services.AddTransient<IProjectsRepository, ProjectsRepository>();
        services.AddSingleton<IQueryFactory, QueryFactory>();

        // Scan and register all FirestoreQueryBuilderBase implementations as singletons
        var assembly = typeof(FirestoreQueryBuilderBase).Assembly;
        var queryBuilderType = typeof(FirestoreQueryBuilderBase);

        var queryBuilderTypes = assembly.GetTypes()
            .Where(type => type.IsClass && !type.IsAbstract && queryBuilderType.IsAssignableFrom(type));

        foreach (var type in queryBuilderTypes)
        {
            services.AddSingleton(typeof(FirestoreQueryBuilderBase), type);
        }
    }
}