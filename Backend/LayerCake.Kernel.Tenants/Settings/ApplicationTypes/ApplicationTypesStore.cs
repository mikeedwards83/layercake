using LayerCake.Kernel.Authentication;
using LayerCake.Kernel.Store;
using LayerCake.Kernel.Store.Tasks;
using LayerCake.Kernel.Tenants.Store;

namespace LayerCake.Kernel.Tenants.Settings.ApplicationTypes;

/// <summary>
/// Store for managing ApplicationType entities
/// </summary>
public class ApplicationTypesStore(
    ITenantContext tenantContext,
    IApplicationTypesRepository repository,
    ApplicationTypeValidator validator,
    IEnumerable<IRecordTask<ApplicationType>> tasks,
    ICurrentUserContext currentUserContext
)
    : TenantStoreBase<ApplicationType, Guid>(tenantContext, repository, validator, tasks, currentUserContext), IApplicationTypesStore
{
    protected override QueryParameters GetGetQueryParameters(Guid id)
    {
        return new GetQueryParameters(id);
    }
}
