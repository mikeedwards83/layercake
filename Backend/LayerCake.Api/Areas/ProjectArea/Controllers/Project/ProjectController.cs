using Frontend;
using LayerCake.Api.Areas.ProjectArea.Controllers.Project.Models;
using LayerCake.Api.Areas.ProjectArea.Controllers.Projects.Models;
using LayerCake.Kernel.Tenants.Projects;
using LayerCake.Kernel.Tenants.Projects.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LayerCake.Api.Areas.ProjectArea.Controllers.Project;

[Area(ApiConstants.Areas.Projects.Name)]
[ApiController]
[Route("api/[area]")]
[Authorize]
public class ProjectController : ControllerBase
{
    private readonly IProjectsStore _projectsStore;
    private readonly ILogger<ProjectController> _logger;


    public const string Name = "Project";

    public ProjectController(
        IProjectsStore projectsStore,
        ILogger<ProjectController> logger)
    {
        _projectsStore = projectsStore ?? throw new ArgumentNullException(nameof(projectsStore));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Gets a project by its key
    /// </summary>
    /// <param name="key">The project key</param>
    /// <returns>The project</returns>
    [HttpGet("{key}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ProjectGetResponse>> GetByKey(string key)
    {
        try
        {
            _logger.LogInformation("Retrieving project with key: {ProjectKey}", key);

            var projects = await _projectsStore.Find(new ProjectByKeyQuery(key, 0, 1));
            var project = projects.FirstOrDefault();

            if (project == null)
            {
                _logger.LogWarning("Project with key {ProjectKey} not found", key);
                return NotFound(new { message = $"Project with key '{key}' not found" });
            }

            var response = new ProjectGetResponse
            {
                Project = ProjectResponse.Map(project)
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving project with key: {ProjectKey}", key);
            return StatusCode(500, new { message = "An error occurred while retrieving the project" });
        }
    }
}
