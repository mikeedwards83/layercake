using FluentValidation;

namespace LayerCake.Api.Controllers.Search.Models;

public class SearchWikiPagesLatestRequest
{
    public Guid ReferenceId { get; set; }
    public int Limit { get; set; } = 5;
}

public class SearchWikiPagesLatestRequestValidator : AbstractValidator<SearchWikiPagesLatestRequest>
{
    public SearchWikiPagesLatestRequestValidator()
    {
        RuleFor(x => x.ReferenceId)
            .NotEmpty().WithMessage("Reference ID is required")
            .NotEqual(Guid.Empty).WithMessage("Reference ID cannot be an empty GUID");

        RuleFor(x => x.Limit)
            .InclusiveBetween(1, 20).WithMessage("Limit must be between 1 and 20");
    }
}
