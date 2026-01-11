namespace LayerCake.Api.Controllers.Search.Models;

/// <summary>
/// Search result for a wiki page
/// </summary>
public class WikiPageSearchResult
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Key { get; set; } = string.Empty;
}

/// <summary>
/// Response containing wiki page search results
/// </summary>
public class WikiPageSearchResponse
{
    public List<WikiPageSearchResult> Results { get; set; } = new();
}
