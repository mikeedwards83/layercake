using LayerCake.Kernel.Store;
using LayerCake.Kernel.Tenants.Store;

namespace LayerCake.Kernel.Tenants.Projects;

/// <summary>
/// Store for managing Project entities
/// </summary>
public class ProjectsStore(
    ITenantContext tenantContext,
    IProjectsRepository repository,
    ProjectValidator validator)
    : TenantStoreBase<Project, Guid>(tenantContext, repository, validator), IProjectsStore
{
    protected override QueryParameters GetGetQueryParameters(Guid id)
    {
        return new GetQueryParameters(id);
    }
}
