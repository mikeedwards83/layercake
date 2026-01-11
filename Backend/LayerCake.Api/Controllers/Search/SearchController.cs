using LayerCake.Api.Controllers.Search.Models;
using LayerCake.Kernel.Tenants.Wikis;
using LayerCake.Kernel.Tenants.Wikis.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LayerCake.Api.Controllers.Search;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SearchController(IWikiPageStore wikiPageStore) : ControllerBase
{
    private readonly IWikiPageStore _wikiPageStore = wikiPageStore;

    /// <summary>
    /// Search for wiki pages by title and reference ID
    /// </summary>
    /// <param name="request">Search parameters including referenceId, title, and limit</param>
    /// <returns>List of matching wiki pages with Id, Title, and Key</returns>
    [HttpGet("wikipages")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<WikiPageSearchResponse>> SearchWikiPages(
        [FromQuery] SearchWikiPagesRequest request)
    {
        // FluentValidation automatically validates the request model

        // Fetch wiki pages using the search query
        // Note: Due to Firestore limitations on text search, the query filters by referenceId
        // and title filtering is performed in-memory
        var wikiPages = await _wikiPageStore.Find(
            new WikiPageSearchQuery(request.ReferenceId, request.Title, 0, request.Limit));

        // Filter by title in-memory if provided (Firestore limitation workaround)
        if (!string.IsNullOrWhiteSpace(request.Title))
        {
            var searchTerm = request.Title.ToLowerInvariant();
            wikiPages = wikiPages.Where(p =>
                p.Title.ToLowerInvariant().Contains(searchTerm) ||
                p.Key.ToLowerInvariant().Contains(searchTerm)
            ).ToList();
        }

        // Map to search results and apply limit
        var results = wikiPages
            .ToList();

        return Ok(MapWikiPageSearchResponse(results, request.Limit));
    }

    /// <summary>
    /// Get the latest wiki pages by reference ID
    /// </summary>
    /// <param name="request">Request parameters including referenceId and limit (1-20, default 5)</param>
    /// <returns>List of the most recently created wiki pages with Id, Title, and Key</returns>
    [HttpGet("wikipages/latest")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<WikiPageSearchResponse>> GetLatestWikiPages(
        [FromQuery] SearchWikiPagesLatestRequest request)
    {
        // FluentValidation automatically validates the request model

        // Fetch wiki pages for the reference
        var wikiPages = await _wikiPageStore.Find(
            new WikiPagesByReferenceQuery(request.ReferenceId, 0, 100));

        // Get the latest pages ordered by creation date (most recent first)
        var results = wikiPages
            .OrderByDescending(p => p.Created)
            .ToList();

        return Ok(MapWikiPageSearchResponse(results,request.Limit));
    }

    private WikiPageSearchResponse MapWikiPageSearchResponse(IEnumerable<Kernel.Tenants.Wikis.WikiPage> pages, int limit)
    {
        var results = pages
            .Take(limit)
            .Select(p => new WikiPageSearchResult
        {
            Id = p.Id,
            Title = p.Title,
            Key = p.Key
        }).ToList();

        return new WikiPageSearchResponse { Results = results };
    } 
}
