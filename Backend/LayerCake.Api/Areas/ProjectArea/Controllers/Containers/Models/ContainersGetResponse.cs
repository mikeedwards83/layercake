namespace LayerCake.Api.Areas.ProjectArea.Controllers.Containers.Models;

public class ContainersGetResponse
{
    public List<ContainerResponse> Containers { get; set; } = new();
}
