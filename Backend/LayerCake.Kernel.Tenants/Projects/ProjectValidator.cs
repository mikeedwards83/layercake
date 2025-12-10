using FluentValidation;
using LayerCake.Kernel.Tenants.Projects.Queries;
using Microsoft.Extensions.DependencyInjection;

namespace LayerCake.Kernel.Tenants.Projects;

/// <summary>
/// Validator for the Project domain model
/// </summary>
public class ProjectValidator : TenantRecordValidator<Project>
{
    public ProjectValidator(IServiceProvider serviceProvider)
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
            .WithMessage(ProjectValidationMessages.KeyInvalidFormat)
            .WhenAsync(async (x, cancellationToken) => !(await IsUniqueKey(serviceProvider.GetRequiredService<IProjectsStore>(), x.Key!)))
            .WithMessage("Project key must be unique");

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
    
    public static async Task<bool> IsUniqueKey(IProjectsStore projectsService, string? key)
    {
        if (string.IsNullOrEmpty(key))
        {
            return false;
        }
        
        var results = await projectsService.Find(new ProjectByKeyQuery(key, 0, 1));
        return !results.Any();
    }
}
