using FirebaseAdmin.Auth;
using Frontend;
using LayerCake.Api.Areas.PublicArea.Controllers.Invites.Models;
using LayerCake.Kernel.Tenants.Invites;
using LayerCake.Kernel.Tenants.Users;
using Microsoft.AspNetCore.Mvc;

namespace LayerCake.Api.Areas.PublicArea.Controllers.Invites;

[Area(ApiConstants.Areas.Public.Name)]
[ApiController]
[Route("api/[controller]")]
public class InvitesController : ControllerBase
{
    private readonly ILogger<InvitesController> _logger;
    private readonly IInvitesStore _invitesStore;
    private readonly IUsersStore _usersStore;

    public InvitesController(
        ILogger<InvitesController> logger,
        IInvitesStore invitesStore,
        IUsersStore usersStore)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _invitesStore = invitesStore ?? throw new ArgumentNullException(nameof(invitesStore));
        _usersStore = usersStore ?? throw new ArgumentNullException(nameof(usersStore));
    }

    /// <summary>
    /// Gets invite details by token
    /// </summary>
    /// <param name="token">The invite token</param>
    /// <returns>Invite details</returns>
    [HttpGet("{token}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<InviteDetailsResponse>> GetInviteDetails(string token)
    {
        try
        {
            _logger.LogInformation("Getting invite details for token: {Token}", token);

            var invites = await _invitesStore.Find(new GetInviteByTokenQuery(token));
            var invite = invites.FirstOrDefault();

            if (invite == null)
            {
                _logger.LogWarning("Invite not found for token: {Token}", token);
                return NotFound(new { message = "Invitation not found or has expired" });
            }

            // Get the user details
            var user = await _usersStore.Get(invite.UserId);
            if (user == null)
            {
                _logger.LogWarning("User not found for invite: {InviteId}", invite.Id);
                return NotFound(new { message = "Invitation is no longer valid" });
            }

            var response = new InviteDetailsResponse
            {
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                InvitedByName = invite.InvitedByName,
                TenantName = "Layer Cake", // TODO: Get actual tenant name when multi-tenancy is implemented
                ExpiresAt = invite.ExpiresAt,
                IsExpired = invite.ExpiresAt < DateTime.UtcNow,
                IsAccepted = invite.IsAccepted
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting invite details for token: {Token}", token);
            return StatusCode(500, new { message = "An error occurred while retrieving invitation details" });
        }
    }

    /// <summary>
    /// Accepts an invitation and sets the user's password
    /// </summary>
    /// <param name="token">The invite token</param>
    /// <param name="request">Password details</param>
    /// <returns>Custom token for Firebase authentication</returns>
    [HttpPost("{token}/accept")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AcceptInviteResponse>> AcceptInvite(string token, [FromBody] AcceptInviteRequest request)
    {
        try
        {
            _logger.LogInformation("Accepting invite for token: {Token}", token);

            // Find the invite
            var invites = await _invitesStore.Find(new GetInviteByTokenQuery(token));
            var invite = invites.FirstOrDefault();

            if (invite == null)
            {
                return NotFound(new { message = "Invitation not found" });
            }

            // Check if already accepted
            if (invite.IsAccepted)
            {
                return BadRequest(new { message = "This invitation has already been accepted" });
            }

            // Check if expired
            if (invite.ExpiresAt < DateTime.UtcNow)
            {
                return BadRequest(new { message = "This invitation has expired" });
            }

            // Get the user
            var user = await _usersStore.Get(invite.UserId);
            if (user == null)
            {
                return NotFound(new { message = "User account not found" });
            }

            // Update Firebase Auth password
            UserRecord firebaseUser;
            try
            {
                // Find the Firebase user by email
                firebaseUser = await FirebaseAuth.DefaultInstance.GetUserByEmailAsync(user.Email);

                // Update the password
                var updateArgs = new UserRecordArgs
                {
                    Uid = firebaseUser.Uid,
                    Password = request.Password,
                    EmailVerified = true
                };

                await FirebaseAuth.DefaultInstance.UpdateUserAsync(updateArgs);
                _logger.LogInformation("Updated Firebase password for user: {Email}", user.Email);
            }
            catch (FirebaseAuthException ex)
            {
                _logger.LogError(ex, "Failed to update Firebase user: {Email}", user.Email);
                return StatusCode(500, new { message = "Failed to set password. Please try again." });
            }

            // Update user status to Completed
            await _usersStore.Update(user, modify =>
            {
                modify.Status = UserStatus.Completed;
                return Task.CompletedTask;
            });
            _logger.LogInformation("Updated user status to Completed: {UserId}", user.Id);

            // Mark invite as accepted
           
            await _invitesStore.Update(invite, modify =>
            {
                modify.IsAccepted = true;
                modify.AcceptedAt = DateTime.UtcNow;
                return Task.CompletedTask;
            });
            _logger.LogInformation("Marked invite as accepted: {InviteId}", invite.Id);

            // Generate custom token for auto-login
            var customToken = await FirebaseAuth.DefaultInstance.CreateCustomTokenAsync(firebaseUser.Uid);

            var response = new AcceptInviteResponse
            {
                CustomToken = customToken,
                Email = user.Email,
                DisplayName = user.DisplayName
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error accepting invite for token: {Token}", token);
            return StatusCode(500, new { message = "An error occurred while accepting the invitation" });
        }
    }
}
