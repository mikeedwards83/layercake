using LayerCake.Kernel.Tenants.Projects;

namespace LayerCake.Api.Controllers.Projects.Models;

public class ProjectResponse
{
    public required Guid Id { get; init; }
    public required Guid TenantId { get; init; }
    public required string Name { get; init; }
    public required string Key { get; init; }
    public required string? Description { get; init; }
    public required string? Icon { get; init; }
    public required string? Color { get; init; }
    public required string? OwnerId { get; init; }

    public static ProjectResponse Map(Kernel.Tenants.Projects.Project project)
    {
        return new ProjectResponse
        {
            Id = project.Id,
            TenantId = project.TenantId,
            Name = project.Name,
            Key = project.Key,
            Description = project.Description,
            Icon = project.Icon,
            Color = project.Color,
            OwnerId = project.OwnerId
        };
    }
}