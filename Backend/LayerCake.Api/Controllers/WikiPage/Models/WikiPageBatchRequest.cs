namespace LayerCake.Api.Controllers.WikiPage;

public class WikiPageBatchRequest
{
    public List<Guid> Ids { get; set; } = new();
}
