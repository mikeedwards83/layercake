using FluentValidation;

namespace LayerCake.Api.Controllers.WikiPage;

public class WikiPageCreateRequest
{
    public string? Title { get; set; }
    public string? Contents { get; set; }
    public Guid? ParentId { get; set; }
    public Guid? ReferenceId { get; set; }
}

public class WikiPageCreateRequestValidator : AbstractValidator<WikiPageCreateRequest>
{
    public WikiPageCreateRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .WithMessage("WikiPage title is required")
            .MaximumLength(100)
            .WithMessage("WikiPage title must not exceed 100 characters");

        RuleFor(x => x.Contents)
            .NotEmpty()
            .WithMessage("WikiPage contents are required")
            .MaximumLength(20000)
            .WithMessage("WikiPage contents must not exceed 20000 characters");

        RuleFor(x => x.ParentId)
            .NotEmpty()
            .WithMessage("Parent ID is required")
            .NotEqual(Guid.Empty)
            .WithMessage("Parent ID cannot be an empty GUID");

        RuleFor(x => x.ReferenceId)
            .NotEmpty()
            .WithMessage("Reference ID is required")
            .NotEqual(Guid.Empty)
            .WithMessage("Reference ID cannot be an empty GUID");
    }
}
