using FirebaseAdmin.Auth;
using Frontend;
using LayerCake.Api.Areas.AdminArea.Controllers.Users.Models;
using LayerCake.Kernel.Authentication;
using LayerCake.Kernel.Email;
using LayerCake.Kernel.Queues.Emails;
using LayerCake.Kernel.Tenants.Invites;
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
    private readonly IInvitesStore _invitesStore;
    private readonly IEmailQueueService _emailQueueService;
    private readonly InviteEmailBuilder _inviteEmailBuilder;
    private readonly ICurrentUserContext _currentUserContext;

    public UsersController(
        ILogger<UsersController> logger,
        IUsersStore usersStore,
        IInvitesStore invitesStore,
        IEmailQueueService emailQueueService,
        InviteEmailBuilder inviteEmailBuilder,
        ICurrentUserContext currentUserContext)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _usersStore = usersStore ?? throw new ArgumentNullException(nameof(usersStore));
        _invitesStore = invitesStore ?? throw new ArgumentNullException(nameof(invitesStore));
        _emailQueueService = emailQueueService ?? throw new ArgumentNullException(nameof(emailQueueService));
        _inviteEmailBuilder = inviteEmailBuilder ?? throw new ArgumentNullException(nameof(inviteEmailBuilder));
        _currentUserContext = currentUserContext ?? throw new ArgumentNullException(nameof(currentUserContext));
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

    /// <summary>
    /// Creates a new user (admin-initiated)
    /// </summary>
    /// <param name="request">User creation details</param>
    /// <returns>The created user</returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<UserResponse>> CreateUser([FromBody] UserCreateRequest request)
    {
        try
        {
            _logger.LogInformation("Admin creating new user with email: {Email}", request.Email);

            // Generate a temporary password for the new user
            var temporaryPassword = GenerateTemporaryPassword();

            // Step 1: Create user in Firebase Authentication
            var userArgs = new UserRecordArgs
            {
                Email = request.Email,
                Password = temporaryPassword,
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
                // Step 2: Create user in database with InvitePending status
                var user = await _usersStore.Add(u =>
                {
                    u.Email = request.Email;
                    u.FirstName = request.FirstName;
                    u.LastName = request.LastName;
                    u.DisplayName = $"{request.FirstName} {request.LastName}";
                    u.Initials = GetInitials(request.FirstName, request.LastName);
                    u.TenantIds = Array.Empty<Guid>();
                    u.Status = UserStatus.InvitePending;
                    return Task.CompletedTask;
                });

                _logger.LogInformation("Created database user with ID: {UserId}", user.Id);

                // Step 3: Get the current user's name for the invite
                var currentUser = await _usersStore.Get(_currentUserContext.User.UserId);
                var invitedByName = currentUser?.DisplayName ?? "An administrator";

                // Step 4: Create an invite record
                var inviteToken = GenerateInviteToken();
                var invite = await _invitesStore.Add(i =>
                {
                    i.UserId = user.Id;
                    i.Email = request.Email;
                    i.Token = inviteToken;
                    i.ExpiresAt = DateTime.UtcNow.AddDays(14); // Valid for 2 weeks
                    i.IsAccepted = false;
                    i.InvitedByName = invitedByName;
                    return Task.CompletedTask;
                });

                _logger.LogInformation("Created invite with ID: {InviteId} for user: {UserId}", invite.Id, user.Id);

                // Step 5: Queue the invite email to be sent in the background
                var emailMessage = _inviteEmailBuilder.BuildInviteEmail(request.Email, inviteToken, invitedByName);
                await _emailQueueService.QueueEmailAsync(emailMessage);

                _logger.LogInformation("Queued invite email for user: {Email}", request.Email);

                var response = UserResponse.Map(user);
                return CreatedAtAction(nameof(GetUser), new { id = user.Id }, response);
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
            _logger.LogError(ex, "Unexpected error during user creation");
            return StatusCode(500, new { message = "An unexpected error occurred during user creation" });
        }
    }

    private static string GenerateTemporaryPassword()
    {
        // Generate a secure temporary password
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
        var random = new Random();
        return new string(Enumerable.Repeat(chars, 16)
            .Select(s => s[random.Next(s.Length)]).ToArray());
    }

    private static string GenerateInviteToken()
    {
        // Generate a secure random token for the invite link
        return Convert.ToBase64String(Guid.NewGuid().ToByteArray())
            .Replace("/", "_")
            .Replace("+", "-")
            .TrimEnd('=');
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
