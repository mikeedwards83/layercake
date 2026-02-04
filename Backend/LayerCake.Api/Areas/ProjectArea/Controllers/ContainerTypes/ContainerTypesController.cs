using LayerCake.Api.Areas.ProjectArea.Controllers.ContainerTypes.Models;
using LayerCake.Kernel.ContainerTypes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LayerCake.Api.Areas.ProjectArea.Controllers.ContainerTypes;

[Area(Frontend.ApiConstants.Areas.Projects.Name)]
[ApiController]
[Route("api/containertypes")]
[Authorize]
public class ContainerTypesController : ControllerBase
{
    public static string Name => nameof(ContainerTypesController);

    private readonly IContainerTypesStore _containerTypesStore;
    private readonly ILogger<ContainerTypesController> _logger;

    public ContainerTypesController(
        IContainerTypesStore containerTypesStore,
        ILogger<ContainerTypesController> logger)
    {
        _containerTypesStore = containerTypesStore ?? throw new ArgumentNullException(nameof(containerTypesStore));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Gets all container types
    /// </summary>
    /// <returns>List of all container types</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ContainerTypesGetResponse>> Get()
    {
        try
        {
            _logger.LogInformation("Retrieving all container types");

            var containerTypes = await _containerTypesStore.GetAll();

            var response = new ContainerTypesGetResponse
            {
                ContainerTypes = containerTypes.Select(ContainerTypeResponse.Map).ToList()
            };

            _logger.LogInformation("Retrieved {Count} container types", containerTypes.Count());

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving container types");
            return StatusCode(500, new { message = "An error occurred while retrieving container types" });
        }
    }
}
