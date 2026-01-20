using LayerCake.Kernel.Authentication;
using LayerCake.Kernel.Store;
using LayerCake.Kernel.Store.Tasks;
using LayerCake.Kernel.Tenants.Store;

namespace LayerCake.Kernel.Tenants.Users;

/// <summary>
/// Store for managing User entities
/// </summary>
public class UsersStore(
    ITenantContext tenantContext,
    IUsersRepository repository,
    UserValidator validator,
    IEnumerable<IRecordTask<User>> tasks,
    ICurrentUserContext currentUserContext
)
    : TenantStoreBase<User, Guid>(tenantContext, repository, validator, tasks, currentUserContext), IUsersStore
{
    protected override QueryParameters GetGetQueryParameters(Guid id)
    {
        return new GetQueryParameters(id);
    }
}
