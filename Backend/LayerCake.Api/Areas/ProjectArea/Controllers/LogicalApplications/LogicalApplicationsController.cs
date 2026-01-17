using Frontend;
using LayerCake.Api.Controllers.LogicalApplications.Models;
using LayerCake.Kernel.Tenants.LogicalApplications;
using LayerCake.Kernel.Tenants.LogicalApplications.Queries;
using LayerCake.Kernel.Tenants.Projects;
using LayerCake.Kernel.Tenants.Projects.Queries;
using LayerCake.Kernel.Tenants.Settings.ApplicationTypes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LayerCake.Api.Controllers.LogicalApplications;

[Area(ApiConstants.Areas.Projects.Name)]
[ApiController]
[Route("api/[area]/{key}/logical")]
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
    /// <param name="key">The project key</param>
    /// <param name="request">The logical application creation request</param>
    /// <returns>The created logical application</returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<LogicalApplicationsPostResponse>> Post(string key, [FromBody] LogicalApplicationsPostRequest request)
    {
        try
        {
            // Verify project exists
            var projects = await _projectsStore.Find(new ProjectByKeyQuery(key, 0, 1));
            var project = projects.FirstOrDefault();

            if (project == null)
            {
                return NotFound(new { message = $"Project with key {key} not found" });
            }

            if (ModelState.IsValid)
            {
                _logger.LogInformation("Creating new logical application for project: {ProjectKey}", key);

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

                return CreatedAtAction(nameof(GetLogicalApplication), new { key = key, id = logicalApplication.Id }, response);
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating logical application for project: {ProjectKey}", key);
            return StatusCode(500,
                new { message = "An error occurred while creating the logical application", error = ex.Message });
        }
    }

    /// <summary>
    /// Gets all logical applications for a project
    /// </summary>
    /// <param name="key">The project key</param>
    /// <returns>List of all logical applications for the project</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<LogicalApplicationsGetResponse>> GetAllLogicalApplications(string key)
    {
        try
        {
            // Verify project exists
            var projects = await _projectsStore.Find(new ProjectByKeyQuery(key, 0, 1));
            var project = projects.FirstOrDefault();

            if (project == null)
            {
                return NotFound(new { message = $"Project with key {key} not found" });
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
            _logger.LogError(ex, "Error retrieving logical applications for project: {ProjectKey}", key);
            return StatusCode(500, new { message = "An error occurred while retrieving logical applications" });
        }
    }

    /// <summary>
    /// Gets a logical application by ID
    /// </summary>
    /// <param name="key">The project key</param>
    /// <param name="id">The logical application ID</param>
    /// <returns>The logical application</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<LogicalApplicationsPostResponse>> GetLogicalApplication(string key, Guid id)
    {
        try
        {
            // Verify project exists
            var projects = await _projectsStore.Find(new ProjectByKeyQuery(key, 0, 1));
            var project = projects.FirstOrDefault();

            if (project == null)
            {
                return NotFound(new { message = $"Project with key {key} not found" });
            }

            var logicalApplication = await _logicalApplicationsStore.Get(id);

            if (logicalApplication == null)
            {
                return NotFound(new { message = $"Logical application with ID {id} not found" });
            }

            // Verify logical application belongs to this project
            if (logicalApplication.ProjectId != project.Id)
            {
                return NotFound(new { message = $"Logical application with ID {id} not found in project {key}" });
            }

            var response = new LogicalApplicationsPostResponse
            {
                LogicalApplication = LogicalApplicationResponse.Map(logicalApplication)
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving logical application with ID: {LogicalApplicationId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the logical application" });
        }
    }
}
