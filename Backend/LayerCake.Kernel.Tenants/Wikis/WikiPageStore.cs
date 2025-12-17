using LayerCake.Kernel.Store;
using LayerCake.Kernel.Tenants.Store;

namespace LayerCake.Kernel.Tenants.Wikis;

/// <summary>
/// Store for managing WikiPage entities
/// </summary>
public class WikiPageStore(
    ITenantContext tenantContext,
    IWikiPageRepository repository,
    WikiPageValidator validator)
    : TenantStoreBase<WikiPage, Guid>(tenantContext, repository, validator), IWikiPageStore
{
    protected override QueryParameters GetGetQueryParameters(Guid id)
    {
        return new GetQueryParameters(id);
    }
}
