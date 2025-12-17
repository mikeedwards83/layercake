using LayerCake.Kernel.Authentication;
using LayerCake.Kernel.Store;
using LayerCake.Kernel.Store.Tasks;
using LayerCake.Kernel.Tenants.Store;

namespace LayerCake.Kernel.Tenants.Wikis;

/// <summary>
/// Store for managing WikiPage entities
/// </summary>
public class WikiPageStore(
    ITenantContext tenantContext,
    IWikiPageRepository repository,
    WikiPageValidator validator,
    IEnumerable<IRecordTask<WikiPage>> tasks,
    ICurrentUserContext currentUserContext
)
    : TenantStoreBase<WikiPage, Guid>(tenantContext, repository, validator, tasks, currentUserContext), IWikiPageStore
{
    protected override QueryParameters GetGetQueryParameters(Guid id)
    {
        return new GetQueryParameters(id);
    }
}