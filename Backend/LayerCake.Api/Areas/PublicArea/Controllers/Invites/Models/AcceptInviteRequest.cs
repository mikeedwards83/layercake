using System.ComponentModel.DataAnnotations;

namespace LayerCake.Api.Areas.PublicArea.Controllers.Invites.Models;

public class AcceptInviteRequest
{
    [Required(ErrorMessage = "Password is required")]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "Confirm password is required")]
    [Compare("Password", ErrorMessage = "Passwords do not match")]
    public string ConfirmPassword { get; set; } = string.Empty;
}
