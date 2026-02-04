using LayerCake.Kernel.ContainerTypes;

namespace LayerCake.Api.Areas.ProjectArea.Controllers.ContainerTypes.Models;

public class ContainerTypeResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public static ContainerTypeResponse Map(ContainerType containerType)
    {
        return new ContainerTypeResponse
        {
            Id = containerType.Id,
            Name = containerType.Name,
            Description = containerType.Description
        };
    }
}
