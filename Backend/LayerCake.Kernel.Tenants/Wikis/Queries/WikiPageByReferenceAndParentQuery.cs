namespace LayerCake.Kernel.Tenants.Wikis.Queries;

/// <summary>
/// Query to retrieve a wiki page by reference ID and parent ID
/// </summary>
public class WikiPageByReferenceAndParentQuery(Guid referenceId, Guid parentId, int skip, int take)
    : TenantQueryParameters(skip, take)
{
    public Guid ReferenceId { get; } = referenceId;
    public Guid ParentId { get; } = parentId;
}
