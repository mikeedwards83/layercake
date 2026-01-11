using FluentValidation;

namespace LayerCake.Api.Controllers.Search.Models;

/// <summary>
/// Request model for searching wiki pages
/// </summary>
public class SearchWikiPagesRequest
{
    public Guid ReferenceId { get; set; }
    public string? Title { get; set; }
    public int Limit { get; set; } = 5;
}

/// <summary>
/// Validator for SearchWikiPagesRequest
/// </summary>
public class SearchWikiPagesRequestValidator : AbstractValidator<SearchWikiPagesRequest>
{
    public SearchWikiPagesRequestValidator()
    {
        RuleFor(x => x.ReferenceId)
            .NotEmpty()
            .WithMessage("Reference ID is required")
            .NotEqual(Guid.Empty)
            .WithMessage("Reference ID cannot be an empty GUID");

        RuleFor(x => x.Limit)
            .InclusiveBetween(1, 20)
            .WithMessage("Limit must be between 1 and 20");

        RuleFor(x => x.Title)
            .MaximumLength(100)
            .WithMessage("Title search term must not exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.Title));
    }
}
