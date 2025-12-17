using FluentValidation;

namespace LayerCake.Kernel.Tenants.Wikis;

/// <summary>
/// Validator for WikiPage entities
/// </summary>
public class WikiPageValidator : TenantRecordValidator<WikiPage>
{
    public WikiPageValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .WithMessage("WikiPage title is required")
            .MaximumLength(100)
            .WithMessage("WikiPage title must not exceed 100 characters");

        RuleFor(x => x.Key)
            .NotEmpty()
            .WithMessage("WikiPage key is required")
            .MaximumLength(50)
            .WithMessage("WikiPage key must not exceed 50 characters")
            .Matches("^[a-z0-9-]+$")
            .WithMessage("WikiPage key can only contain lowercase letters, numbers, and hyphens");

        RuleFor(x => x.Contents)
            .NotEmpty()
            .WithMessage("WikiPage contents are required")
            .MaximumLength(20000)
            .WithMessage("WikiPage contents must not exceed 20000 characters");

        RuleFor(x => x.ReferenceId)
            .NotEmpty()
            .WithMessage("Reference ID is required");

        RuleFor(x => x.UpdatedBy)
            .NotEmpty()
            .WithMessage("Updated by user ID is required");

        RuleFor(x => x.CreatedBy)
            .NotEmpty()
            .WithMessage("Created by user ID is required");
    }

    /// <summary>
    /// Validates if a wiki page key is unique within a reference
    /// </summary>
    public static async Task<bool> IsUniqueKey(IWikiPageStore wikiPageStore, string key, Guid referenceId, Guid? excludeId = null)
    {
        var wikiPages = await wikiPageStore.Find(new Queries.WikiPageByKeyAndReferenceQuery(key, referenceId, 0, 1));
        var existing = wikiPages.FirstOrDefault();

        if (existing == null)
            return true;

        // If we're updating and it's the same record, it's valid
        return excludeId.HasValue && existing.Id == excludeId.Value;
    }
}
