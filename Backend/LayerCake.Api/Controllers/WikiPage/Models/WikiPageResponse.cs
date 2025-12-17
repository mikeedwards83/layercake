namespace LayerCake.Api.Controllers.WikiPage;

public class WikiPageResponse
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Key { get; set; } = string.Empty;
    public string Contents { get; set; } = string.Empty;
    public Guid ReferenceId { get; set; }
    public Guid ParentId { get; set; }
    public DateTime Updated { get; set; }
    public Guid UpdatedBy { get; set; }
    public DateTime Created { get; set; }
    public Guid CreatedBy { get; set; }

    public static WikiPageResponse Map(Kernel.Tenants.Wikis.WikiPage wikiPage)
    {
        return new WikiPageResponse
        {
            Id = wikiPage.Id,
            TenantId = wikiPage.TenantId,
            Title = wikiPage.Title,
            Key = wikiPage.Key,
            Contents = wikiPage.Contents,
            ReferenceId = wikiPage.ReferenceId,
            ParentId = wikiPage.ParentId,
            Updated = wikiPage.Updated,
            UpdatedBy = wikiPage.UpdatedBy,
            Created = wikiPage.Created,
            CreatedBy = wikiPage.CreatedBy
        };
    }
}
