using FluentValidation;

namespace LayerCake.Api.Controllers.LogicalApplications.Models;

public class LogicalApplicationsPostRequest
{
    public string? Name { get; set; }
    public Guid ProjectId { get; set; }
    public string? Description { get; set; }
    public string? OwnerId { get; set; }

    public class LogicalApplicationsPostRequestValidator : AbstractValidator<LogicalApplicationsPostRequest>
    {
        public LogicalApplicationsPostRequestValidator(IServiceProvider serviceProvider)
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("Logical application name is required")
                .MaximumLength(100)
                .WithMessage("Logical application name must not exceed 100 characters");

            RuleFor(x => x.ProjectId)
                .NotEmpty()
                .WithMessage("Project ID is required");

            RuleFor(x => x.Description)
                .MaximumLength(500)
                .WithMessage("Description must not exceed 500 characters")
                .When(x => !string.IsNullOrEmpty(x.Description));

            RuleFor(x => x.OwnerId)
                .MaximumLength(128)
                .WithMessage("Owner ID must not exceed 128 characters")
                .When(x => !string.IsNullOrEmpty(x.OwnerId));
        }
    }
}
