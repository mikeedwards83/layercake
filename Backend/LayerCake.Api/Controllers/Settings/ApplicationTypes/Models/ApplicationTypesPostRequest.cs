using FluentValidation;

namespace LayerCake.Api.Controllers.Settings.ApplicationTypes.Models;

public class ApplicationTypesPostRequest
{
    public string? Name { get; set; }

    public class ApplicationTypesPostRequestValidator : AbstractValidator<ApplicationTypesPostRequest>
    {
        public ApplicationTypesPostRequestValidator(IServiceProvider serviceProvider)
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("Application type name is required")
                .MaximumLength(100)
                .WithMessage("Application type name must not exceed 100 characters");
        }
    }
}
