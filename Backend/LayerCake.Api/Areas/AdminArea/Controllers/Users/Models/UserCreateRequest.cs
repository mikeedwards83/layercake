using System.ComponentModel.DataAnnotations;

namespace LayerCake.Api.Areas.AdminArea.Controllers.Users.Models;

public class UserCreateRequest
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    [MaxLength(256, ErrorMessage = "Email must be 256 characters or less")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "First name is required")]
    [MaxLength(100, ErrorMessage = "First name must be 100 characters or less")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Last name is required")]
    [MaxLength(100, ErrorMessage = "Last name must be 100 characters or less")]
    public string LastName { get; set; } = string.Empty;
}
