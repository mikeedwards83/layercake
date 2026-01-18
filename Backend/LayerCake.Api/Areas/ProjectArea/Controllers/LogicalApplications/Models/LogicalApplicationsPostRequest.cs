using FluentValidation;

namespace LayerCake.Api.Areas.ProjectArea.Controllers.LogicalApplications.Models;

public class LogicalApplicationsPostRequest
{
    public string? Name { get; set; }
    public string? Key { get; set; }
    public string? Description { get; set; }
    public Guid? OwnerId { get; set; }
    public Guid? ApplicationTypeId { get; set; }
    public string? CustomApplicationTypeName { get; set; }

    public class LogicalApplicationsPostRequestValidator : AbstractValidator<LogicalApplicationsPostRequest>
    {
        public LogicalApplicationsPostRequestValidator(IServiceProvider serviceProvider)
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("Logical application name is required")
                .MaximumLength(100)
                .WithMessage("Logical application name must not exceed 100 characters");

            RuleFor(x => x.Key)
                .NotEmpty()
                .WithMessage("Logical application key is required")
                .MaximumLength(10)
                .WithMessage("Key must not exceed 10 characters")
                .Matches("^[A-Z0-9]+$")
                .WithMessage("Key must contain only uppercase letters and numbers");

            RuleFor(x => x.Description)
                .MaximumLength(500)
                .WithMessage("Description must not exceed 500 characters")
                .When(x => !string.IsNullOrEmpty(x.Description));

            RuleFor(x => x.OwnerId)
                .NotEmpty()
                .WithMessage("Owner ID is required");
  
            RuleFor(x => x.ApplicationTypeId)
                .Must((request, applicationTypeId) =>
                {
                    // Either ApplicationTypeId OR CustomApplicationTypeName must be provided
                    return applicationTypeId.HasValue || !string.IsNullOrEmpty(request.CustomApplicationTypeName);
                })
                .WithMessage("Either Application type or Custom application type name is required");

            RuleFor(x => x.CustomApplicationTypeName)
                .Must((request, customTypeName) =>
                {
                    // Either ApplicationTypeId OR CustomApplicationTypeName must be provided
                    return request.ApplicationTypeId.HasValue || !string.IsNullOrEmpty(customTypeName);
                })
                .WithMessage("Either Application type or Custom application type name is required")
                .MaximumLength(100)
                .WithMessage("Custom application type name must not exceed 100 characters")
                .When(x => !string.IsNullOrEmpty(x.CustomApplicationTypeName));
        }
    }
}
