namespace LayerCake.Kernel.Tenants.Wikis.Queries;

/// <summary>
/// Query to retrieve a wiki by its key
/// </summary>
public class WikiPageByKeyQuery(string wikiKey, int skip, int take) : TenantQueryParameters(skip, take)
{
    public string WikiKey { get; } = wikiKey.ToLowerInvariant();
}
