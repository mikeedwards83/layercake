using FluentValidation;
using LayerCake.Kernel.Tenants.LogicalApplications.Queries;
using Microsoft.Extensions.DependencyInjection;

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
            .WithMessage("Key must contain only uppercase letters and numbers")
            .MustAsync(async (logicalApp, key, cancellationToken) =>
                await IsUniqueKeyInProject(serviceProvider.GetRequiredService<ILogicalApplicationsStore>(), logicalApp))
            .WithMessage("A logical application with this key already exists in the project");

        RuleFor(l => l.ProjectId)
            .NotEmpty()
            .WithMessage("Project ID is required");

        RuleFor(l => l.Description)
            .MaximumLength(500)
            .WithMessage("Description must not exceed 500 characters")
            .When(l => !string.IsNullOrEmpty(l.Description));
    }

    public static async Task<bool> IsUniqueKeyInProject(ILogicalApplicationsStore logicalApplicationsStore, LogicalApplication logicalApplication)
    {
        var existing = await GetExistingByKey(logicalApplicationsStore, logicalApplication.ProjectId, logicalApplication.Key);

        if (existing == null)
        {
            return true;
        }

        return existing.Id == logicalApplication.Id;
    }

    private static async Task<LogicalApplication?> GetExistingByKey(ILogicalApplicationsStore logicalApplicationsStore, Guid projectId, string key)
    {
        if (string.IsNullOrEmpty(key))
        {
            return null;
        }

        var results = await logicalApplicationsStore.Find(new GetLogicalApplicationsByProjectQuery(projectId, 0, 1, key));
        return results.FirstOrDefault();
    }
}
