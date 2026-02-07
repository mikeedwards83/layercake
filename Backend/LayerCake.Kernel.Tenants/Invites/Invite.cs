using LayerCake.Kernel.Store;

namespace LayerCake.Kernel.Tenants.Invites;

/// <summary>
/// Represents a user invitation
/// </summary>
public class Invite : IRecord
{
    public Guid Id { get; set; }
    public Guid CreatedBy { get; set; }
    public Guid UpdatedBy { get; set; }
    public DateTime Created { get; set; }
    public DateTime Updated { get; set; }

    /// <summary>
    /// The ID of the user being invited
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// The email address the invitation was sent to
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Unique token for the invitation link
    /// </summary>
    public string Token { get; set; } = string.Empty;

    /// <summary>
    /// When the invitation expires (2 weeks from creation)
    /// </summary>
    public DateTime ExpiresAt { get; set; }

    /// <summary>
    /// Whether the invitation has been accepted
    /// </summary>
    public bool IsAccepted { get; set; }

    /// <summary>
    /// When the invitation was accepted (if applicable)
    /// </summary>
    public DateTime? AcceptedAt { get; set; }

    /// <summary>
    /// Display name of the user who created the invitation
    /// </summary>
    public string InvitedByName { get; set; } = string.Empty;
}
