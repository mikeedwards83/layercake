namespace LayerCake.Kernel.Tenants.Wikis.Queries;

/// <summary>
/// Query to retrieve a wiki by its key and reference ID
/// </summary>
public class WikiPageByKeyAndReferenceQuery(string wikiKey, Guid referenceId, int skip, int take) : TenantQueryParameters(skip, take)
{
    public string WikiKey { get; } = wikiKey.ToLowerInvariant();
    public Guid ReferenceId { get; } = referenceId;
}
