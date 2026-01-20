using LayerCake.Kernel.Tenants.Users;

namespace LayerCake.Api.Areas.AdminArea.Controllers.Users.Models;

public class UserResponse
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Initials { get; set; } = string.Empty;
    public Guid[] TenantIds { get; set; } = Array.Empty<Guid>();
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public static UserResponse Map(User user)
    {
        return new UserResponse
        {
            Id = user.Id,
            Email = user.Email,
            DisplayName = user.DisplayName,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Initials = user.Initials,
            TenantIds = user.TenantIds,
            CreatedAt = new DateTimeOffset(user.Created),
            UpdatedAt = new DateTimeOffset(user.Updated)
        };
    }
}
