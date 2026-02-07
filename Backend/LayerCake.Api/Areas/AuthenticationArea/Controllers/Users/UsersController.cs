using FirebaseAdmin.Auth;
using Frontend;
using LayerCake.Api.Areas.AuthenticationArea.Controllers.Users.Models;
using LayerCake.Kernel.Authentication;
using LayerCake.Kernel.Tenants.Users;
using Microsoft.AspNetCore.Mvc;

namespace LayerCake.Api.Areas.AuthenticationArea.Controllers.Users;

[Area(ApiConstants.Areas.Authentication.Name)]
[ApiController]
[Route("api/[area]/[controller]")]
public class UsersController : ControllerBase
{
    private readonly ILogger<UsersController> _logger;
    private readonly IUsersStore _usersStore;
    private readonly ICurrentUserContext _currentUserContext;

    public UsersController(ILogger<UsersController> logger, IUsersStore usersStore, ICurrentUserContext currentUserContext)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _usersStore = usersStore ?? throw new ArgumentNullException(nameof(usersStore));
        _currentUserContext = currentUserContext ?? throw new ArgumentNullException(nameof(currentUserContext));
    }

    /// <summary>
    /// Registers a new user in both Firebase Authentication and the database
    /// </summary>
    /// <param name="request">User registration details</param>
    /// <returns>The created user</returns>
    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<RegistrationResponse>> Register(
        [FromBody] UserRegistrationRequest request)
    {
        try
        {
            _logger.LogInformation("Registering new user with email: {Email}", request.Email);

            // Step 1: Create user in Firebase Authentication
            var userArgs = new UserRecordArgs
            {
                Email = request.Email,
                Password = request.Password,
                DisplayName = $"{request.FirstName} {request.LastName}",
                EmailVerified = false,
                Disabled = false
            };

            UserRecord firebaseUser;
            try
            {
                firebaseUser = await FirebaseAuth.DefaultInstance.CreateUserAsync(userArgs);
                _logger.LogInformation("Created Firebase Auth user with UID: {Uid}", firebaseUser.Uid);
            }
            catch (FirebaseAuthException ex)
            {
                var errorMessage = GetFirebaseErrorMessage(ex);
                _logger.LogError(ex, "Failed to create Firebase Auth user: {ErrorMessage}", errorMessage);
                return BadRequest(new { message = errorMessage });
            }

            try
            {
                // Step 2: Create user in database with EmailPending status
                var user = await _usersStore.Add(u =>
                {
                    u.Email = request.Email;
                    u.FirstName = request.FirstName;
                    u.LastName = request.LastName;
                    u.DisplayName = $"{request.FirstName} {request.LastName}";
                    u.Initials = GetInitials(request.FirstName, request.LastName);
                    u.TenantIds = Array.Empty<Guid>(); // Will be assigned when user joins a tenant
                    u.Status = UserStatus.EmailPending;
                    return Task.CompletedTask;
                });

                _logger.LogInformation("Created database user with ID: {UserId}", user.Id);

                // Step 3: Authenticate the newly created user
                _currentUserContext.Authenticate(user.Id);

                // Step 4: Generate a custom token so the client can sign in
                var customToken = await FirebaseAuth.DefaultInstance.CreateCustomTokenAsync(firebaseUser.Uid);

                var response = RegistrationResponse.Map(user, customToken);
                return CreatedAtAction(nameof(Register), new { id = user.Id }, response);
            }
            catch (Exception dbEx)
            {
                // Rollback: Delete the Firebase user if database creation fails
                _logger.LogError(dbEx, "Failed to create database user, rolling back Firebase user");
                try
                {
                    await FirebaseAuth.DefaultInstance.DeleteUserAsync(firebaseUser.Uid);
                    _logger.LogInformation("Rolled back Firebase user creation");
                }
                catch (Exception rollbackEx)
                {
                    _logger.LogError(rollbackEx, "Failed to rollback Firebase user creation");
                }

                return StatusCode(500, new { message = "Failed to create user account. Please try again." });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error during user registration");
            return StatusCode(500, new { message = "An unexpected error occurred during registration" });
        }
    }

    private static string GetInitials(string firstName, string lastName)
    {
        var firstInitial = string.IsNullOrWhiteSpace(firstName) ? "" : firstName.Substring(0, 1).ToUpper();
        var lastInitial = string.IsNullOrWhiteSpace(lastName) ? "" : lastName.Substring(0, 1).ToUpper();
        return $"{firstInitial}{lastInitial}";
    }

    private static string GetFirebaseErrorMessage(FirebaseAuthException ex)
    {
        return ex.AuthErrorCode switch
        {
            AuthErrorCode.EmailAlreadyExists => "An account with this email already exists",
            _ => "Failed to create account. Please try again"
        };
    }
}
