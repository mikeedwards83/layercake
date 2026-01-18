using FluentValidation;

namespace LayerCake.Kernel.Tenants.LogicalApplications;

/// <summary>
/// Validator for the LogicalApplication domain model
/// </summary>
public class LogicalApplicationValidator : TenantRecordValidator<LogicalApplication>
{
    public LogicalApplicationValidator(IServiceProvider serviceProvider)
    {
        RuleFor(l => l.Name)
            .NotEmpty()
            .WithMessage("Logical application name is required")
            .MaximumLength(100)
            .WithMessage("Logical application name must not exceed 100 characters");

        RuleFor(l => l.Key)
            .NotEmpty()
            .WithMessage("Logical application key is required")
            .MaximumLength(10)
            .WithMessage("Key must not exceed 10 characters")
            .Matches("^[A-Z0-9]+$")
            .WithMessage("Key must contain only uppercase letters and numbers");

        RuleFor(l => l.ProjectId)
            .NotEmpty()
            .WithMessage("Project ID is required");

        RuleFor(l => l.Description)
            .MaximumLength(500)
            .WithMessage("Description must not exceed 500 characters")
            .When(l => !string.IsNullOrEmpty(l.Description));
    }
}
