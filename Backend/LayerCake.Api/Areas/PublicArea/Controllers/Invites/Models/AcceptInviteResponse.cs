namespace LayerCake.Api.Areas.PublicArea.Controllers.Invites.Models;

public class AcceptInviteResponse
{
    public string CustomToken { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
}
