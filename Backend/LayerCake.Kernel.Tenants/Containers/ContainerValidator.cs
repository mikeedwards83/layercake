using FluentValidation;
using LayerCake.Kernel.Tenants.Containers.Queries;
using Microsoft.Extensions.DependencyInjection;

namespace LayerCake.Kernel.Tenants.Containers;

/// <summary>
/// Validator for the Container domain model
/// </summary>
public class ContainerValidator : TenantRecordValidator<Container>
{
    public ContainerValidator(IServiceProvider serviceProvider)
    {
        RuleFor(c => c.Name)
            .NotEmpty()
            .WithMessage("Container name is required")
            .MaximumLength(100)
            .WithMessage("Container name must not exceed 100 characters");

        RuleFor(c => c.Key)
            .NotEmpty()
            .WithMessage("Container key is required")
            .MaximumLength(10)
            .WithMessage("Key must not exceed 10 characters")
            .Matches("^[A-Z0-9]+$")
            .WithMessage("Key must contain only uppercase letters and numbers")
            .MustAsync(async (container, key, cancellationToken) =>
                await IsUniqueKeyInProject(serviceProvider.GetRequiredService<IContainersStore>(), container))
            .WithMessage("A container with this key already exists in the project");

        RuleFor(c => c.ProjectId)
            .NotEmpty()
            .WithMessage("Project ID is required");

        RuleFor(c => c.LogicalApplicationId)
            .NotEmpty()
            .WithMessage("Logical Application ID is required");

        RuleFor(c => c.Type)
            .GreaterThan(0)
            .WithMessage("Container type is required");

        RuleFor(c => c.Description)
            .MaximumLength(500)
            .WithMessage("Description must not exceed 500 characters")
            .When(c => !string.IsNullOrEmpty(c.Description));

        RuleFor(c => c.Icon)
            .MaximumLength(100)
            .WithMessage("Icon name must not exceed 100 characters")
            .When(c => !string.IsNullOrEmpty(c.Icon));
    }

    public static async Task<bool> IsUniqueKeyInProject(IContainersStore containersStore, Container container)
    {
        var existing = await GetExistingByKey(containersStore, container.ProjectId, container.Key);

        if (existing == null)
        {
            return true;
        }

        return existing.Id == container.Id;
    }

    private static async Task<Container?> GetExistingByKey(IContainersStore containersStore, Guid projectId, string key)
    {
        if (string.IsNullOrEmpty(key))
        {
            return null;
        }

        var results = await containersStore.Find(new GetContainersByProjectQuery(projectId, 0, 1, key));
        return results.FirstOrDefault();
    }
}
