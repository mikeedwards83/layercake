using FluentValidation;

namespace LayerCake.Kernel.Tenants.Projects;

/// <summary>
/// Validator for the Project domain model
/// </summary>
public class ProjectValidator : TenantRecordValidator<Project>
{
    public ProjectValidator()
    {
        RuleFor(p => p.Name)
            .NotEmpty()
            .WithMessage(ProjectValidationMessages.NameRequired)
            .MaximumLength(50)
            .WithMessage(ProjectValidationMessages.NameMaxLength);

        RuleFor(p => p.Key)
            .NotEmpty()
            .WithMessage(ProjectValidationMessages.KeyRequired)
            .MaximumLength(10)
            .WithMessage(ProjectValidationMessages.KeyMaxLength)
            .Matches(@"^[A-Z0-9]+$")
            .WithMessage(ProjectValidationMessages.KeyInvalidFormat);

        RuleFor(p => p.Description)
            .NotEmpty()
            .WithMessage(ProjectValidationMessages.DescriptionRequired)
            .MaximumLength(300)
            .WithMessage(ProjectValidationMessages.DescriptionMaxLength);

        RuleFor(p => p.Icon)
            .NotEmpty()
            .WithMessage(ProjectValidationMessages.IconRequired);

        RuleFor(p => p.Color)
            .NotEmpty()
            .WithMessage(ProjectValidationMessages.ColorRequired)
            .Matches(@"^#[0-9A-Fa-f]{6}$")
            .WithMessage(ProjectValidationMessages.ColorInvalidFormat);

        RuleFor(p => p.OwnerId)
            .NotEmpty()
            .WithMessage(ProjectValidationMessages.OwnerIdRequired);
    }
}
