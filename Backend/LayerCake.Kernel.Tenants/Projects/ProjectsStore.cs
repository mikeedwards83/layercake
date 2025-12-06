using LayerCake.Kernel.Store;
using LayerCake.Kernel.Tenants.Store;

namespace LayerCake.Kernel.Tenants.Projects;

/// <summary>
/// Store for managing Project entities
/// </summary>
public class ProjectsStore : TenantStoreBase<Project, Guid>
{
    public ProjectsStore(
        ITenantContext tenantContext,
        IProjectsRepository repository
        ) : base(tenantContext, repository)
    {
    }

    protected override QueryParameters GetGetQueryParameters(Guid id)
    {
        return new GetQueryParameters(id);
    }
}
