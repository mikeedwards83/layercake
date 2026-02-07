using FluentValidation;
using LayerCake.Kernel.Tenants.Projects;
using LayerCake.Kernel.Tenants.Wikis;
using LayerCake.Kernel.Tenants.LogicalApplications;
using LayerCake.Kernel.Tenants.Settings.ApplicationTypes;
using LayerCake.Kernel.Tenants.Users;
using LayerCake.Kernel.Tenants.Invites;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace LayerCake.Kernel.Tenants;

public static class ServiceCollectionExtension
{
    public static void AddTenantStores(this IServiceCollection services)
    {
        services.AddTransient<IProjectsStore, ProjectsStore>();
        services.AddTransient<IWikiPageStore, WikiPageStore>();
        services.AddTransient<ILogicalApplicationsStore, LogicalApplicationsStore>();
        services.AddTransient<IApplicationTypesStore, ApplicationTypesStore>();
        services.AddTransient<IUsersStore, UsersStore>();
        services.AddTransient<IInvitesStore, InvitesStore>();
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