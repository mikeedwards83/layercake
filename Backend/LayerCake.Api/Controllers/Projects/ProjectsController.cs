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
    public async Task<ActionResult<ProjectsPostResponse>> Post([FromBody] ProjectsPostRequest request)
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

                var response = new ProjectsPostResponse
                {
                   Project = ProjectResponse.Map(project)
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
    /// Gets all projects
    /// </summary>
    /// <returns>List of all projects</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<ProjectsPostResponse>>> GetAllProjects()
    {
        try
        {
            var projects = await _projectsStore.Find(new GetAllProjectsQuery(0, 100));

            var response = new ProjectsGetResponse
            {
                Projects = projects.Select(ProjectResponse.Map).ToList()
            };
            
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving projects");
            return StatusCode(500, new { message = "An error occurred while retrieving projects" });
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
    public async Task<ActionResult<ProjectsPostResponse>> GetProject(Guid id)
    {
        try
        {
            var project = await _projectsStore.Get(id);

            if (project == null)
            {
                return NotFound(new { message = $"Project with ID {id} not found" });
            }

            var response = new ProjectsPostResponse
            {
                Project =  ProjectResponse.Map(project)
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