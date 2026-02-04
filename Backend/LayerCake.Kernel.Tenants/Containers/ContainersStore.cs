using LayerCake.Kernel.Authentication;
using LayerCake.Kernel.Store;
using LayerCake.Kernel.Store.Tasks;
using LayerCake.Kernel.Tenants.Store;

namespace LayerCake.Kernel.Tenants.Containers;

/// <summary>
/// Store for managing Container entities
/// </summary>
public class ContainersStore(
    ITenantContext tenantContext,
    IContainersRepository repository,
    ContainerValidator validator,
    IEnumerable<IRecordTask<Container>> tasks,
    ICurrentUserContext currentUserContext
)
    : TenantStoreBase<Container, Guid>(tenantContext, repository, validator, tasks, currentUserContext), IContainersStore
{
    protected override QueryParameters GetGetQueryParameters(Guid id)
    {
        return new GetQueryParameters(id);
    }
}
