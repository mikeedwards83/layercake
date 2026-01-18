using Frontend;
using LayerCake.Api.Areas.ProjectArea.Controllers.LogicalApplication;
using LayerCake.Api.Areas.ProjectArea.Controllers.LogicalApplications.Models;
using LayerCake.Kernel.Tenants.LogicalApplications;
using LayerCake.Kernel.Tenants.LogicalApplications.Queries;
using LayerCake.Kernel.Tenants.Projects;
using LayerCake.Kernel.Tenants.Projects.Queries;
using LayerCake.Kernel.Tenants.Settings.ApplicationTypes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LayerCake.Api.Areas.ProjectArea.Controllers.LogicalApplications;

[Area(ApiConstants.Areas.Projects.Name)]
[ApiController]
[Route("api/[area]/{projectkey}/logical")]
[Authorize]
public class LogicalApplicationsController : ControllerBase
{
    private readonly ILogicalApplicationsStore _logicalApplicationsStore;
    private readonly IProjectsStore _projectsStore;
    private readonly IApplicationTypesStore _applicationTypesStore;
    private readonly ILogger<LogicalApplicationsController> _logger;

    public LogicalApplicationsController(
        ILogicalApplicationsStore logicalApplicationsStore,
        IProjectsStore projectsStore,
        IApplicationTypesStore applicationTypesStore,
        ILogger<LogicalApplicationsController> logger)
    {
        _logicalApplicationsStore = logicalApplicationsStore ?? throw new ArgumentNullException(nameof(logicalApplicationsStore));
        _projectsStore = projectsStore ?? throw new ArgumentNullException(nameof(projectsStore));
        _applicationTypesStore = applicationTypesStore ?? throw new ArgumentNullException(nameof(applicationTypesStore));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Creates a new logical application for a project
    /// </summary>
    /// <param name="projectkey">The project key</param>
    /// <param name="request">The logical application creation request</param>
    /// <returns>The created logical application</returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<LogicalApplicationsPostResponse>> Post(string projectkey, [FromBody] LogicalApplicationsPostRequest request)
    {
        try
        {
            // Verify project exists
            var projects = await _projectsStore.Find(new ProjectByKeyQuery(projectkey, 0, 1));
            var project = projects.FirstOrDefault();

            if (project == null)
            {
                return NotFound(new { message = $"Project with key {projectkey} not found" });
            }

            if (ModelState.IsValid)
            {
                _logger.LogInformation("Creating new logical application for project: {ProjectKey}", projectkey);

                // Handle custom type creation if needed
                Guid? applicationTypeId = request.ApplicationTypeId;
                if (!string.IsNullOrEmpty(request.CustomApplicationTypeName))
                {
                    var customType = await _applicationTypesStore.Add(async (t) =>
                    {
                        t.Id = Guid.NewGuid();
                        t.Name = request.CustomApplicationTypeName;
                        t.IsCustom = true;
                        await Task.CompletedTask;
                    });
                    applicationTypeId = customType.Id;
                }

                var logicalApplication = await _logicalApplicationsStore.Add(async (l) =>
                {
                    l.Id = Guid.NewGuid();
                    l.Name = request.Name!;
                    l.Key = request.Key!;
                    l.ProjectId = project.Id;
                    l.Description = request.Description!;
                    l.OwnerId = request.OwnerId!.Value;
                    l.ApplicationTypeId = applicationTypeId.Value;
                    await Task.CompletedTask;
                });

                var response = new LogicalApplicationsPostResponse
                {
                    LogicalApplication = LogicalApplicationResponse.Map(logicalApplication)
                };

                _logger.LogInformation("Successfully created logical application with ID: {LogicalApplicationId}", logicalApplication.Id);

                return CreatedAtAction(nameof(LogicalApplicationController.GetLogicalApplicationByKey), LogicalApplicationController.Name, new { area = ApiConstants.Areas.Projects.Name, projectKey = projectkey, logicalKey = logicalApplication.Key }, response);
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating logical application for project: {ProjectKey}", projectkey);
            return StatusCode(500,
                new { message = "An error occurred while creating the logical application", error = ex.Message });
        }
    }

    /// <summary>
    /// Gets all logical applications for a project
    /// </summary>
    /// <param name="projectkey">The project key</param>
    /// <returns>List of all logical applications for the project</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<LogicalApplicationsGetResponse>> GetAllLogicalApplications(string projectkey)
    {
        try
        {
            // Verify project exists
            var projects = await _projectsStore.Find(new ProjectByKeyQuery(projectkey, 0, 1));
            var project = projects.FirstOrDefault();

            if (project == null)
            {
                return NotFound(new { message = $"Project with key {projectkey} not found" });
            }

            var logicalApplications = await _logicalApplicationsStore.Find(new GetLogicalApplicationsByProjectQuery(project.Id, 0, 100));

            var response = new LogicalApplicationsGetResponse
            {
                LogicalApplications = logicalApplications.Select(LogicalApplicationResponse.Map).ToList()
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving logical applications for project: {ProjectKey}", projectkey);
            return StatusCode(500, new { message = "An error occurred while retrieving logical applications" });
        }
    }
}
