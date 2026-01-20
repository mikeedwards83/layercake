using Frontend;
using LayerCake.Api.Areas.AdminArea.Controllers.Users.Models;
using LayerCake.Kernel.Tenants.Users;
using LayerCake.Kernel.Tenants.Users.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LayerCake.Api.Areas.AdminArea.Controllers.Users;

[Area(ApiConstants.Areas.Admin.Name)]
[ApiController]
[Route("api/[area]/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly ILogger<UsersController> _logger;
    private readonly IUsersStore _usersStore;

    public UsersController(ILogger<UsersController> logger, IUsersStore usersStore)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _usersStore = usersStore ?? throw new ArgumentNullException(nameof(usersStore));
    }

    /// <summary>
    /// Gets all users from the database with optional filtering and pagination
    /// </summary>
    /// <param name="search">Optional search term to filter by display name or email</param>
    /// <param name="page">Page number (1-based)</param>
    /// <param name="pageSize">Number of items per page (default: 20)</param>
    /// <returns>List of filtered and paginated users</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<UsersGetResponse>> GetAllUsers(
        [FromQuery] string? search = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            _logger.LogInformation("Retrieving users from database with filters - Search: {Search}, Page: {Page}, PageSize: {PageSize}",
                search, page, pageSize);

            var skip = (page - 1) * pageSize;
            var users = await _usersStore.Find(new GetAllUsersQuery(skip, pageSize));

            var allUsers = users.Select(UserResponse.Map).ToList();

            // Apply search filter if provided
            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchLower = search.ToLower();
                allUsers = allUsers
                    .Where(u =>
                        (u.DisplayName?.ToLower().Contains(searchLower) ?? false) ||
                        (u.Email?.ToLower().Contains(searchLower) ?? false) ||
                        (u.FirstName?.ToLower().Contains(searchLower) ?? false) ||
                        (u.LastName?.ToLower().Contains(searchLower) ?? false))
                    .ToList();
            }

            var totalCount = allUsers.Count;

            _logger.LogInformation("Successfully retrieved {UserCount} users", totalCount);

            var response = new UsersGetResponse
            {
                Users = allUsers,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving users from database");
            return StatusCode(500, new { message = "An error occurred while retrieving users" });
        }
    }

    /// <summary>
    /// Gets a user by ID
    /// </summary>
    /// <param name="id">The user ID (GUID)</param>
    /// <returns>The user</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserResponse>> GetUser(Guid id)
    {
        try
        {
            _logger.LogInformation("Retrieving user with ID: {UserId}", id);

            var user = await _usersStore.Get(id);

            if (user == null)
            {
                return NotFound(new { message = $"User with ID {id} not found" });
            }

            var response = UserResponse.Map(user);

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user with ID: {UserId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the user" });
        }
    }
}
