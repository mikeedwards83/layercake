using Frontend;
using LayerCake.Api.Areas.ProjectArea.Controllers.Containers.Models;
using LayerCake.Kernel.Tenants.Containers;
using LayerCake.Kernel.Tenants.Containers.Queries;
using LayerCake.Kernel.Tenants.LogicalApplications;
using LayerCake.Kernel.Tenants.LogicalApplications.Queries;
using LayerCake.Kernel.Tenants.Projects;
using LayerCake.Kernel.Tenants.Projects.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LayerCake.Api.Areas.ProjectArea.Controllers.Containers;

[Area(ApiConstants.Areas.Projects.Name)]
[ApiController]
[Route("api/[area]/{projectkey}/logical/{logicalkey}/containers")]
[Authorize]
public class ContainersController : ControllerBase
{
    private readonly IContainersStore _containersStore;
    private readonly ILogicalApplicationsStore _logicalApplicationsStore;
    private readonly IProjectsStore _projectsStore;
    private readonly ILogger<ContainersController> _logger;

    public ContainersController(
        IContainersStore containersStore,
        ILogicalApplicationsStore logicalApplicationsStore,
        IProjectsStore projectsStore,
        ILogger<ContainersController> logger)
    {
        _containersStore = containersStore ?? throw new ArgumentNullException(nameof(containersStore));
        _logicalApplicationsStore = logicalApplicationsStore ?? throw new ArgumentNullException(nameof(logicalApplicationsStore));
        _projectsStore = projectsStore ?? throw new ArgumentNullException(nameof(projectsStore));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Creates a new container for a logical application
    /// </summary>
    /// <param name="projectkey">The project key</param>
    /// <param name="logicalkey">The logical application key</param>
    /// <param name="request">The container creation request</param>
    /// <returns>The created container</returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ContainersPostResponse>> Post(string projectkey, string logicalkey, [FromBody] ContainersPostRequest request)
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

            // Verify logical application exists
            var logicalApplications = await _logicalApplicationsStore.Find(new GetLogicalApplicationsByProjectQuery(project.Id, 0, 1, logicalkey));
            var logicalApplication = logicalApplications.FirstOrDefault();

            if (logicalApplication == null)
            {
                return NotFound(new { message = $"Logical application with key {logicalkey} not found in project {projectkey}" });
            }

            if (ModelState.IsValid)
            {
                _logger.LogInformation("Creating new container for logical application: {LogicalKey} in project: {ProjectKey}", logicalkey, projectkey);

                var container = await _containersStore.Add(async (c) =>
                {
                    c.Id = Guid.NewGuid();
                    c.Name = request.Name!;
                    c.Key = request.Key!;
                    c.ProjectId = project.Id;
                    c.LogicalApplicationId = logicalApplication.Id;
                    c.Description = request.Description ?? string.Empty;
                    c.Type = request.Type!.Value;
                    c.Icon = request.Icon ?? string.Empty;
                    await Task.CompletedTask;
                });

                var response = new ContainersPostResponse
                {
                    Container = ContainerResponse.Map(container)
                };

                _logger.LogInformation("Successfully created container with ID: {ContainerId}", container.Id);

                return CreatedAtAction(nameof(Get), new { area = ApiConstants.Areas.Projects.Name, projectkey, logicalkey }, response);
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
        catch (FluentValidation.ValidationException ex)
        {
            foreach (var error in ex.Errors)
            {
                ModelState.AddModelError(error.PropertyName, error.ErrorMessage);
            }

            return BadRequest(ModelState);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating container for logical application: {LogicalKey} in project: {ProjectKey}", logicalkey, projectkey);
            return StatusCode(500, new { message = "An error occurred while creating the container" });
        }
    }

    /// <summary>
    /// Gets all containers for a logical application
    /// </summary>
    /// <param name="projectkey">The project key</param>
    /// <param name="logicalkey">The logical application key</param>
    /// <returns>List of containers</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ContainersGetResponse>> Get(string projectkey, string logicalkey)
    {
        try
        {
            _logger.LogInformation("Retrieving containers for logical application: {LogicalKey} in project: {ProjectKey}", logicalkey, projectkey);

            // Verify project exists
            var projects = await _projectsStore.Find(new ProjectByKeyQuery(projectkey, 0, 1));
            var project = projects.FirstOrDefault();

            if (project == null)
            {
                return NotFound(new { message = $"Project with key {projectkey} not found" });
            }

            // Verify logical application exists
            var logicalApplications = await _logicalApplicationsStore.Find(new GetLogicalApplicationsByProjectQuery(project.Id, 0, 1, logicalkey));
            var logicalApplication = logicalApplications.FirstOrDefault();

            if (logicalApplication == null)
            {
                return NotFound(new { message = $"Logical application with key {logicalkey} not found in project {projectkey}" });
            }

            var containers = await _containersStore.Find(new GetContainersByLogicalApplicationQuery(logicalApplication.Id, 0, 100));

            var response = new ContainersGetResponse
            {
                Containers = containers.Select(ContainerResponse.Map).ToList()
            };

            _logger.LogInformation("Retrieved {Count} containers", containers.Count());

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving containers for logical application: {LogicalKey} in project: {ProjectKey}", logicalkey, projectkey);
            return StatusCode(500, new { message = "An error occurred while retrieving containers" });
        }
    }
}
