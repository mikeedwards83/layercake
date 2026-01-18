using FirebaseAdmin.Auth;

namespace LayerCake.Api.Areas.AdminArea.Controllers.Users.Models;

public class UserResponse
{
    public string Uid { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? DisplayName { get; set; }
    public string? PhotoUrl { get; set; }
    public bool EmailVerified { get; set; }
    public bool Disabled { get; set; }
    public DateTimeOffset? CreatedAt { get; set; }
    public DateTimeOffset? LastSignInAt { get; set; }

    public static UserResponse Map(UserRecord userRecord)
    {
        return new UserResponse
        {
            Uid = userRecord.Uid,
            Email = userRecord.Email ?? string.Empty,
            DisplayName = userRecord.DisplayName,
            PhotoUrl = userRecord.PhotoUrl,
            EmailVerified = userRecord.EmailVerified,
            Disabled = userRecord.Disabled,
            CreatedAt = userRecord.UserMetaData.CreationTimestamp.HasValue
                ? new DateTimeOffset(userRecord.UserMetaData.CreationTimestamp.Value)
                : null,
            LastSignInAt = userRecord.UserMetaData.LastSignInTimestamp.HasValue
                ? new DateTimeOffset(userRecord.UserMetaData.LastSignInTimestamp.Value)
                : null
        };
    }
}
