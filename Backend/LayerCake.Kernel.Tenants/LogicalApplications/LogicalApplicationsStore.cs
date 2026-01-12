using LayerCake.Kernel.Authentication;
using LayerCake.Kernel.Store;
using LayerCake.Kernel.Store.Tasks;
using LayerCake.Kernel.Tenants.Store;

namespace LayerCake.Kernel.Tenants.LogicalApplications;

/// <summary>
/// Store for managing LogicalApplication entities
/// </summary>
public class LogicalApplicationsStore(
    ITenantContext tenantContext,
    ILogicalApplicationsRepository repository,
    LogicalApplicationValidator validator,
    IEnumerable<IRecordTask<LogicalApplication>> tasks,
    ICurrentUserContext currentUserContext
)
    : TenantStoreBase<LogicalApplication, Guid>(tenantContext, repository, validator, tasks, currentUserContext), ILogicalApplicationsStore
{
    protected override QueryParameters GetGetQueryParameters(Guid id)
    {
        return new GetQueryParameters(id);
    }
}
