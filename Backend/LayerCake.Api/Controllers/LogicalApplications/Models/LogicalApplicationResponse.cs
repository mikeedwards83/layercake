using LayerCake.Kernel.Tenants.LogicalApplications;

namespace LayerCake.Api.Controllers.LogicalApplications.Models;

public class LogicalApplicationResponse
{
    public required Guid Id { get; init; }
    public required Guid TenantId { get; init; }
    public required string Name { get; init; }
    public required Guid ProjectId { get; init; }
    public required string? Description { get; init; }
    public required string? OwnerId { get; init; }
    public required DateTime Created { get; init; }
    public required Guid CreatedBy { get; init; }
    public required DateTime Updated { get; init; }
    public required Guid UpdatedBy { get; init; }

    public static LogicalApplicationResponse Map(LogicalApplication logicalApplication)
    {
        return new LogicalApplicationResponse
        {
            Id = logicalApplication.Id,
            TenantId = logicalApplication.TenantId,
            Name = logicalApplication.Name,
            ProjectId = logicalApplication.ProjectId,
            Description = logicalApplication.Description,
            OwnerId = logicalApplication.OwnerId,
            Created = logicalApplication.Created,
            CreatedBy = logicalApplication.CreatedBy,
            Updated = logicalApplication.Updated,
            UpdatedBy = logicalApplication.UpdatedBy
        };
    }
}
