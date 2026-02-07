namespace LayerCake.Kernel.Tenants.Users;

/// <summary>
/// Represents the status of a user account
/// </summary>
public enum UserStatus
{
    /// <summary>
    /// User was invited by an admin and has not yet accepted
    /// </summary>
    InvitePending = 0,

    /// <summary>
    /// User has signed up but has not yet verified their email
    /// </summary>
    EmailPending = 1,

    /// <summary>
    /// User account is fully activated
    /// </summary>
    Completed = 2,

    /// <summary>
    /// User account has been disabled
    /// </summary>
    Disabled = 3
}
