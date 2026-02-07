using LayerCake.Kernel.Tenants.Store;

namespace LayerCake.Kernel.Tenants.Users;

/// <summary>
/// Represents a user entity
/// </summary>
public class User : ITenantRecord
{
    public Guid Id { get; set; }
    public Guid CreatedBy { get; set; }
    public Guid UpdatedBy { get; set; }
    public DateTime Created { get; set; }
    public DateTime Updated { get; set; }

    /// <summary>
    /// Array of tenants the user is a member of
    /// </summary>
    public Guid[] TenantIds { get; set; } = Array.Empty<Guid>();

    /// <summary>
    /// Gets or sets the user's display name
    /// </summary>
    public string DisplayName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets initials generated from the user's First Name and Last Name
    /// </summary>
    public string Initials { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the user's first name
    /// </summary>
    public string FirstName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the user's last name
    /// </summary>
    public string LastName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the user's email address
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the user's account status
    /// </summary>
    public UserStatus Status { get; set; } = UserStatus.InvitePending;

    public Guid TenantId { get; set; }
}
