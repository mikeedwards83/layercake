using LayerCake.Kernel.Tenants.Containers;

namespace LayerCake.Api.Areas.ProjectArea.Controllers.Containers.Models;

public class ContainerResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Key { get; set; } = string.Empty;
    public Guid ProjectId { get; set; }
    public Guid LogicalApplicationId { get; set; }
    public string Description { get; set; } = string.Empty;
    public int Type { get; set; }
    public string Icon { get; set; } = string.Empty;
    public DateTime Created { get; set; }
    public DateTime Updated { get; set; }

    public static ContainerResponse Map(Container container)
    {
        return new ContainerResponse
        {
            Id = container.Id,
            Name = container.Name,
            Key = container.Key,
            ProjectId = container.ProjectId,
            LogicalApplicationId = container.LogicalApplicationId,
            Description = container.Description,
            Type = container.Type,
            Icon = container.Icon,
            Created = container.Created,
            Updated = container.Updated
        };
    }
}
