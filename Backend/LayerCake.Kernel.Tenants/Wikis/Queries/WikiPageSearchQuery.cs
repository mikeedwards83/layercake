using LayerCake.Kernel.Tenants.Store;

namespace LayerCake.Kernel.Tenants.Wikis.Queries;

/// <summary>
/// Query to search wiki pages by reference ID and optional title filter
/// </summary>
public class WikiPageSearchQuery : TenantQueryParameters
{
    public Guid ReferenceId { get; }
    public string? Title { get; }

    public WikiPageSearchQuery(Guid referenceId, string? title, int skip, int take)
        : base(skip, take)
    {
        ReferenceId = referenceId;
        Title = title;
    }
}
