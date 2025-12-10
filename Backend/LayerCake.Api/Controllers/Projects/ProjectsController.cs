using LayerCake.Api.Controllers.Projects.Models;
using LayerCake.Kernel.Tenants.Projects;
using LayerCake.Kernel.Tenants.Projects.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LayerCake.Api.Controllers.Projects;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProjectsController : ControllerBase
{
    private readonly IProjectsStore _projectsStore;
    private readonly ILogger<ProjectsController> _logger;

    public ProjectsController(
        IProjectsStore projectsStore,
        ILogger<ProjectsController> logger)
    {
        _projectsStore = projectsStore ?? throw new ArgumentNullException(nameof(projectsStore));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Creates a new project
    /// </summary>
    /// <param name="request">The project creation request</param>
    /// <returns>The created project</returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ProjectPostResponse>> Post([FromBody] ProjectsPostRequest request)
    {
        try
        {
            if (request.Key != null && !await ProjectValidator.IsUniqueKey(_projectsStore, request.Key))
            {
                ModelState.AddModelError(nameof(request.Key), $"The key {request.Key} must be unique");
            }

            if (ModelState.IsValid)
            {
                _logger.LogInformation("Creating new project with key: {ProjectKey}", request.Key);

                var project = await _projectsStore.Add(async (p) =>
                {
                    p.Id = Guid.NewGuid();
                    p.Name = request.Name;
                    p.Key = request.Key;
                    p.Description = request.Description;
                    p.Icon = request.Icon;
                    p.Color = request.Color;
                    p.OwnerId = request.OwnerId;
                    await Task.CompletedTask;
                });

                var response = new ProjectPostResponse
                {
                    Id = project.Id,
                    TenantId = project.TenantId,
                    Name = project.Name,
                    Key = project.Key,
                    Description = project.Description,
                    Icon = project.Icon,
                    Color = project.Color,
                    OwnerId = project.OwnerId
                };

                _logger.LogInformation("Successfully created project with ID: {ProjectId}", project.Id);

                return CreatedAtAction(nameof(GetProject), new { id = project.Id }, response);
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating project with key: {ProjectKey}", request.Key);
            return StatusCode(500,
                new { message = "An error occurred while creating the project", error = ex.Message });
        }
    }

    /// <summary>
    /// Gets a project by ID
    /// </summary>
    /// <param name="id">The project ID</param>
    /// <returns>The project</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProjectPostResponse>> GetProject(Guid id)
    {
        try
        {
            var project = await _projectsStore.Get(id);

            if (project == null)
            {
                return NotFound(new { message = $"Project with ID {id} not found" });
            }

            var response = new ProjectPostResponse
            {
                Id = project.Id,
                TenantId = project.TenantId,
                Name = project.Name,
                Key = project.Key,
                Description = project.Description,
                Icon = project.Icon,
                Color = project.Color,
                OwnerId = project.OwnerId
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving project with ID: {ProjectId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the project" });
        }
    }
}