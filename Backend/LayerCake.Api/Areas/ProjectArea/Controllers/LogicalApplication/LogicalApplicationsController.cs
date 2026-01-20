using Frontend;
using LayerCake.Api.Areas.ProjectArea.Controllers.LogicalApplication.Models;
using LayerCake.Kernel.Tenants.LogicalApplications;
using LayerCake.Kernel.Tenants.LogicalApplications.Queries;
using LayerCake.Kernel.Tenants.Projects;
using LayerCake.Kernel.Tenants.Projects.Queries;
using LayerCake.Kernel.Tenants.Settings.ApplicationTypes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LayerCake.Api.Areas.ProjectArea.Controllers.LogicalApplication;

[Area(ApiConstants.Areas.Projects.Name)]
[ApiController]
[Route("api/[area]/{projectKey}/logical/{logicalKey}")]
[Authorize]
public class LogicalApplicationController : ControllerBase
{
    private readonly ILogicalApplicationsStore _logicalApplicationsStore;
    private readonly IProjectsStore _projectsStore;
    private readonly IApplicationTypesStore _applicationTypesStore;
    private readonly ILogger<LogicalApplicationController> _logger;

    public const string Name = "LogicalApplication";
    
    public LogicalApplicationController(
        ILogicalApplicationsStore logicalApplicationsStore,
        IProjectsStore projectsStore,
        IApplicationTypesStore applicationTypesStore,
        ILogger<LogicalApplicationController> logger)
    {
        _logicalApplicationsStore = logicalApplicationsStore ?? throw new ArgumentNullException(nameof(logicalApplicationsStore));
        _projectsStore = projectsStore ?? throw new ArgumentNullException(nameof(projectsStore));
        _applicationTypesStore = applicationTypesStore ?? throw new ArgumentNullException(nameof(applicationTypesStore));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Gets a logical application by key
    /// </summary>
    /// <param name="projectkey">The project key</param>
    /// <param name="logicalKey">The logical application key</param>
    /// <returns>The logical application</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<LogicalApplicationResponse>> GetLogicalApplicationByKey(string projectKey, string logicalKey)
    {
        try
        {
            // Verify project exists
            var projects = await _projectsStore.Find(new ProjectByKeyQuery(projectKey, 0, 1));
            var project = projects.FirstOrDefault();

            if (project == null)
            {
                return NotFound(new { message = $"Project with key {projectKey} not found" });
            }

            // Get the logical application by project ID and key
            var logicalApplications = await _logicalApplicationsStore.Find(new GetLogicalApplicationsByProjectQuery(project.Id, 0, 1, logicalKey));
            var logicalApplication = logicalApplications.FirstOrDefault();

            if (logicalApplication == null)
            {
                return NotFound(new { message = $"Logical application with key {logicalKey} not found in project {projectKey}" });
            }

            var response = LogicalApplicationResponse.Map(logicalApplication);

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving logical application with key: {LogicalApplicationKey}", logicalKey);
            return StatusCode(500, new { message = "An error occurred while retrieving the logical application" });
        }
    }
}
