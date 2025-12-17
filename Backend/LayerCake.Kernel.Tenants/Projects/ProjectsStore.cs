using LayerCake.Kernel.Authentication;
using LayerCake.Kernel.Store;
using LayerCake.Kernel.Store.Tasks;
using LayerCake.Kernel.Tenants.Store;

namespace LayerCake.Kernel.Tenants.Projects;

/// <summary>
/// Store for managing Project entities
/// </summary>
public class ProjectsStore(
    ITenantContext tenantContext,
    IProjectsRepository repository,
    ProjectValidator validator,
    IEnumerable<IRecordTask<Project>> tasks,
    ICurrentUserContext currentUserContext
)
    : TenantStoreBase<Project, Guid>(tenantContext, repository, validator, tasks, currentUserContext), IProjectsStore
{
    protected override QueryParameters GetGetQueryParameters(Guid id)
    {
        return new GetQueryParameters(id);
    }
}