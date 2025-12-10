using FluentValidation;
using LayerCake.Kernel.Tenants.Projects;
using LayerCake.Kernel.Tenants.Projects.Queries;

namespace LayerCake.Api.Controllers.Projects.Models
{
    public class ProjectsPostRequest
    {
        public string? Name { get; set; }
        public string? Key { get; set; }
        public string? Description { get; set; }
        public string? Icon { get; set; }
        public string? Color { get; set; }
        public string? OwnerId { get; set; }
        
        public class ProjectsPostRequestValidator : AbstractValidator<ProjectsPostRequest>
        {
            public ProjectsPostRequestValidator(IServiceProvider serviceProvider)
            {
                RuleFor(x => x.Name)
                    .NotEmpty()
                    .WithMessage("Project name is required")
                    .MaximumLength(100)
                    .WithMessage("Project name must not exceed 100 characters");

                RuleFor(x => x.Key)
                    .NotEmpty()
                    .WithMessage("Project key is required")
                    .MaximumLength(50)
                    .WithMessage("Project key must not exceed 50 characters")
                    .Matches("^[a-zA-Z0-9-_]+$")
                    .WithMessage("Project key can only contain letters, numbers, hyphens, and underscores");

                RuleFor(x => x.Description)
                    .MaximumLength(500)
                    .WithMessage("Description must not exceed 500 characters")
                    .When(x => !string.IsNullOrEmpty(x.Description));

                RuleFor(x => x.Icon)
                    .MaximumLength(100)
                    .WithMessage("Icon must not exceed 100 characters")
                    .When(x => !string.IsNullOrEmpty(x.Icon));

                RuleFor(x => x.Color)
                    .MaximumLength(50)
                    .WithMessage("Color must not exceed 50 characters")
                    .Matches("^#[0-9A-Fa-f]{6}$")
                    .WithMessage("Color must be a valid hex color code (e.g., #FF5733)")
                    .When(x => !string.IsNullOrEmpty(x.Color));

                RuleFor(x => x.OwnerId)
                    .MaximumLength(128)
                    .WithMessage("Owner ID must not exceed 128 characters")
                    .When(x => !string.IsNullOrEmpty(x.OwnerId));
            }

          
        }
    }
}
