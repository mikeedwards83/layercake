using System.ComponentModel.DataAnnotations;

namespace LayerCake.Api.Controllers.Projects.Models
{
    public class ProjectsPostRequest
    {
        [Required]
        public string? Name { get; init; }

        [Required]
        public  string? Key { get; init; }
        public  string? Description { get; init; }
        public  string? Icon { get; init; }
        public  string? Color { get; init; }
        public  string? OwnerId { get; init; }
    }
}
