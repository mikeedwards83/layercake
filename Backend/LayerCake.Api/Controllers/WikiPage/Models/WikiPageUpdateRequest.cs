using FluentValidation;

namespace LayerCake.Api.Controllers.WikiPage;

public class WikiPageUpdateRequest
{
    public string? Title { get; set; }
    public string? Contents { get; set; }
    public Guid? ParentId { get; set; }
}

public class WikiPageUpdateRequestValidator : AbstractValidator<WikiPageUpdateRequest>
{
    public WikiPageUpdateRequestValidator()
    {
        RuleFor(x => x.Title)
            .MaximumLength(100)
            .WithMessage("WikiPage title must not exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.Title));

        RuleFor(x => x.Contents)
            .MaximumLength(20000)
            .WithMessage("WikiPage contents must not exceed 20000 characters")
            .When(x => x.Contents != null);

        RuleFor(x => x.ParentId)
            .NotEqual(Guid.Empty)
            .WithMessage("Parent ID cannot be an empty GUID")
            .When(x => x.ParentId.HasValue);
    }
}
