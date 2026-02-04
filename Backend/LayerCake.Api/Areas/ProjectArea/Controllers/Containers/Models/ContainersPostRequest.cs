using System.ComponentModel.DataAnnotations;

namespace LayerCake.Api.Areas.ProjectArea.Controllers.Containers.Models;

public class ContainersPostRequest
{
    [Required(ErrorMessage = "Container name is required")]
    [MaxLength(100, ErrorMessage = "Container name must not exceed 100 characters")]
    public string? Name { get; set; }

    [Required(ErrorMessage = "Container key is required")]
    [MaxLength(10, ErrorMessage = "Key must not exceed 10 characters")]
    [RegularExpression("^[A-Z0-9]+$", ErrorMessage = "Key must contain only uppercase letters and numbers")]
    public string? Key { get; set; }

    [MaxLength(500, ErrorMessage = "Description must not exceed 500 characters")]
    public string? Description { get; set; }

    [Required(ErrorMessage = "Container type is required")]
    [Range(1, int.MaxValue, ErrorMessage = "Container type must be selected")]
    public int? Type { get; set; }

    [MaxLength(100, ErrorMessage = "Icon name must not exceed 100 characters")]
    public string? Icon { get; set; }
}
