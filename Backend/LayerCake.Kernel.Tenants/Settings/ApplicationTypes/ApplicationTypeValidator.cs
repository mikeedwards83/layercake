using FluentValidation;

namespace LayerCake.Kernel.Tenants.Settings.ApplicationTypes;

/// <summary>
/// Validator for the ApplicationType domain model
/// </summary>
public class ApplicationTypeValidator : TenantRecordValidator<ApplicationType>
{
    public ApplicationTypeValidator(IServiceProvider serviceProvider)
    {
        RuleFor(a => a.Name)
            .NotEmpty()
            .WithMessage("Application type name is required")
            .MaximumLength(100)
            .WithMessage("Application type name must not exceed 100 characters");
    }
}
