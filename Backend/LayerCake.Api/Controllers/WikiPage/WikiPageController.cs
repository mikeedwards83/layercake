using LayerCake.Kernel.Tenants.Wikis;
using LayerCake.Kernel.Tenants.Wikis.Queries;
using Microsoft.AspNetCore.Mvc;

namespace LayerCake.Api.Controllers.WikiPage;

[ApiController]
[Route("api/wikipage")]
public class WikiPageController(IWikiPageStore wikiPageStore) : ControllerBase
{
    private readonly IWikiPageStore _wikiPageStore = wikiPageStore;

    /// <summary>
    /// Get a wiki page by key and reference ID
    /// </summary>
    [HttpGet("{referenceId}/{key}")]
    public async Task<ActionResult<WikiPageGetResponse>> GetByKeyAndReference(Guid referenceId, string key)
    {
        var wikiPages = await _wikiPageStore.Find(new WikiPageByKeyAndReferenceQuery(key, referenceId, 0, 1));
        var wikiPage = wikiPages.FirstOrDefault();

        if (wikiPage == null)
            return NotFound(new { message = $"Wiki page with key '{key}' not found for reference '{referenceId}'" });

        return Ok(new WikiPageGetResponse { WikiPage = WikiPageResponse.Map(wikiPage) });
    }

    /// <summary>
    /// Get a wiki page by reference ID and parent ID (use empty Guid for root)
    /// </summary>
    [HttpGet("{referenceId}/parent/{parentId}")]
    public async Task<ActionResult<WikiPageGetResponse>> GetByReferenceAndParent(Guid referenceId, Guid parentId)
    {
        var wikiPages = await _wikiPageStore.Find(new WikiPageByReferenceAndParentQuery(referenceId, parentId, 0, 1));
        var wikiPage = wikiPages.FirstOrDefault();

        if (wikiPage == null)
            return NotFound(new { message = $"Wiki page not found for reference '{referenceId}' and parent '{parentId}'" });

        return Ok(new WikiPageGetResponse { WikiPage = WikiPageResponse.Map(wikiPage) });
    }

    /// <summary>
    /// Get all wiki pages for a reference ID
    /// </summary>
    [HttpGet("{referenceId}")]
    public async Task<ActionResult<WikiPagesGetResponse>> GetByReference(Guid referenceId)
    {
        var wikiPages = await _wikiPageStore.Find(new WikiPagesByReferenceQuery(referenceId, 0, 100));
        var response = wikiPages.Select(WikiPageResponse.Map).ToList();

        return Ok(new WikiPagesGetResponse { WikiPages = response });
    }

    /// <summary>
    /// Create a new wiki page
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<WikiPageGetResponse>> Create([FromBody] WikiPageCreateRequest request)
    {
        // Generate key from title: lowercase, replace spaces with hyphens, limit to 50 chars
        var key = request.Title!
            .ToLowerInvariant()
            .Replace(" ", "-")
            .Replace("_", "-");

        // Remove any characters that aren't lowercase letters, numbers, or hyphens
        key = new string(key.Where(c => char.IsLetterOrDigit(c) || c == '-').ToArray());

        // Limit to 50 characters
        if (key.Length > 50)
            key = key.Substring(0, 50);

        var wikiPage = await _wikiPageStore.Add(async (page) =>
        {
            page.Id = Guid.NewGuid();
            page.Title = request.Title!;
            page.Key = key;
            page.Contents = request.Contents!;
            page.ParentId = request.ParentId!.Value;
            page.ReferenceId = request.ReferenceId!.Value;
            await Task.CompletedTask;
        });

        return CreatedAtAction(nameof(GetByKeyAndReference),
            new { referenceId = wikiPage.ReferenceId, key = wikiPage.Key },
            new WikiPageGetResponse { WikiPage = WikiPageResponse.Map(wikiPage) });
    }

    /// <summary>
    /// Update a wiki page
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<WikiPageGetResponse>> Update(Guid id, [FromBody] WikiPageUpdateRequest request)
    {
        var wikiPage = await _wikiPageStore.Get(id);

        if (wikiPage == null)
            return NotFound(new { message = $"Wiki page with ID '{id}' not found" });

        var updatedPage = await _wikiPageStore.Update(wikiPage, async (page) =>
        {
            if (!string.IsNullOrEmpty(request.Title))
                page.Title = request.Title;

            if (request.Contents != null)
                page.Contents = request.Contents;

            if (request.ParentId.HasValue)
                page.ParentId = request.ParentId.Value;
        });

        return Ok(new WikiPageGetResponse { WikiPage = WikiPageResponse.Map(updatedPage) });
    }
}
