namespace LayerCake.Api.Controllers.Projects.Models;

public class ProjectsGetResponse
{
    public IEnumerable<ProjectResponse> Projects { get; set; }
}