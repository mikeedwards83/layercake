namespace LayerCake.Api.Areas.PublicArea.Controllers.Invites.Models;

public class InviteDetailsResponse
{
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string InvitedByName { get; set; } = string.Empty;
    public string TenantName { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public bool IsExpired { get; set; }
    public bool IsAccepted { get; set; }
}
