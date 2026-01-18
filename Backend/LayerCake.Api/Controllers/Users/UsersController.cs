using FirebaseAdmin.Auth;
using LayerCake.Api.Controllers.Users.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LayerCake.Api.Controllers.Users;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly ILogger<UsersController> _logger;

    public UsersController(ILogger<UsersController> logger)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Gets all users from Firebase Authentication
    /// </summary>
    /// <returns>List of all users</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<UsersGetResponse>> GetAllUsers()
    {
        try
        {
            _logger.LogInformation("Retrieving all users from Firebase Authentication");

            var users = new List<UserResponse>();
            var pagedEnumerable = FirebaseAuth.DefaultInstance.ListUsersAsync(null);

            var enumerator = pagedEnumerable.GetAsyncEnumerator();

            while (await enumerator.MoveNextAsync())
            {
                var userRecord = enumerator.Current;
                users.Add(UserResponse.Map(userRecord));
            }

            _logger.LogInformation("Successfully retrieved {UserCount} users", users.Count);

            var response = new UsersGetResponse
            {
                Users = users
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving users from Firebase Authentication");
            return StatusCode(500, new { message = "An error occurred while retrieving users" });
        }
    }

    /// <summary>
    /// Gets a user by ID
    /// </summary>
    /// <param name="id">The user ID</param>
    /// <returns>The user</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserResponse>> GetUser(string id)
    {
        try
        {
            _logger.LogInformation("Retrieving user with ID: {UserId}", id);

            var userRecord = await FirebaseAuth.DefaultInstance.GetUserAsync(id);

            if (userRecord == null)
            {
                return NotFound(new { message = $"User with ID {id} not found" });
            }

            var response = UserResponse.Map(userRecord);

            return Ok(response);
        }
        catch (FirebaseAuthException ex) when (ex.AuthErrorCode == AuthErrorCode.UserNotFound)
        {
            _logger.LogWarning("User with ID {UserId} not found", id);
            return NotFound(new { message = $"User with ID {id} not found" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user with ID: {UserId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the user" });
        }
    }
}
