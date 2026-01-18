namespace LayerCake.Api.Areas.ProjectArea.Controllers.Projects.Models;

public class ProjectsGetResponse
{
    public IEnumerable<ProjectResponse> Projects { get; set; }
}