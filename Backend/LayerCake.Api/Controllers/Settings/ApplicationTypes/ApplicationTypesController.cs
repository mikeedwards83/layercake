using LayerCake.Api.Controllers.Settings.ApplicationTypes.Models;
using LayerCake.Kernel.Tenants.Settings.ApplicationTypes;
using LayerCake.Kernel.Tenants.Settings.ApplicationTypes.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LayerCake.Api.Controllers.Settings.ApplicationTypes;

[Area("Settings")]
[ApiController]
[Route("api/[area]/applicationtypes")]
[Authorize]
public class ApplicationTypesController : ControllerBase
{
    private readonly IApplicationTypesStore _applicationTypesStore;
    private readonly ILogger<ApplicationTypesController> _logger;

    public ApplicationTypesController(
        IApplicationTypesStore applicationTypesStore,
        ILogger<ApplicationTypesController> logger)
    {
        _applicationTypesStore = applicationTypesStore ?? throw new ArgumentNullException(nameof(applicationTypesStore));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Gets all application types
    /// </summary>
    /// <returns>List of all application types</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApplicationTypesGetResponse>> GetAllApplicationTypes()
    {
        try
        {
            var applicationTypes = await _applicationTypesStore.Find(new GetAllApplicationTypesQuery(0, 100));

            var response = new ApplicationTypesGetResponse
            {
                ApplicationTypes = applicationTypes.Select(ApplicationTypeResponse.Map).ToList()
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving application types");
            return StatusCode(500, new { message = "An error occurred while retrieving application types" });
        }
    }

    /// <summary>
    /// Creates a new application type
    /// </summary>
    /// <param name="request">The application type creation request</param>
    /// <returns>The created application type</returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApplicationTypesPostResponse>> Post([FromBody] ApplicationTypesPostRequest request)
    {
        try
        {
            if (ModelState.IsValid)
            {
                _logger.LogInformation("Creating new application type: {Name}", request.Name);

                var applicationType = await _applicationTypesStore.Add(async (a) =>
                {
                    a.Id = Guid.NewGuid();
                    a.Name = request.Name;
                    a.IsCustom = true; // User-created types are always custom
                    await Task.CompletedTask;
                });

                var response = new ApplicationTypesPostResponse
                {
                    ApplicationType = ApplicationTypeResponse.Map(applicationType)
                };

                _logger.LogInformation("Successfully created application type with ID: {ApplicationTypeId}", applicationType.Id);

                return CreatedAtAction(nameof(GetApplicationType), new { id = applicationType.Id }, response);
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating application type: {Name}", request.Name);
            return StatusCode(500,
                new { message = "An error occurred while creating the application type", error = ex.Message });
        }
    }

    /// <summary>
    /// Gets an application type by ID
    /// </summary>
    /// <param name="id">The application type ID</param>
    /// <returns>The application type</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApplicationTypesPostResponse>> GetApplicationType(Guid id)
    {
        try
        {
            var applicationType = await _applicationTypesStore.Get(id);

            if (applicationType == null)
            {
                return NotFound(new { message = $"Application type with ID {id} not found" });
            }

            var response = new ApplicationTypesPostResponse
            {
                ApplicationType = ApplicationTypeResponse.Map(applicationType)
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving application type with ID: {ApplicationTypeId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the application type" });
        }
    }
}
