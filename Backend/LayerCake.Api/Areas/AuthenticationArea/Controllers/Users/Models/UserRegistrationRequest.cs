using System.ComponentModel.DataAnnotations;

namespace LayerCake.Api.Areas.AuthenticationArea.Controllers.Users.Models;

public class UserRegistrationRequest
{
    [Required]
    [StringLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(256)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?""':{}|<>]).{8,}$",
        ErrorMessage = "Password must include at least one uppercase letter, one lowercase letter, and one special character")]
    public string Password { get; set; } = string.Empty;
}
