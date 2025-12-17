namespace LayerCake.Kernel.Tenants.Wikis.Queries;

/// <summary>
/// Query to retrieve all wikis for a specific reference ID
/// </summary>
public class WikiPagesByReferenceQuery(Guid referenceId, int skip, int take) : TenantQueryParameters(skip, take)
{
    public Guid ReferenceId { get; } = referenceId;
}
