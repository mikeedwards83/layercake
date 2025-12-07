namespace LayerCake.Api.Controllers.Projects.Models
{
    public class ProjectPostResponse
    {
        public required Guid Id { get; init; }
        public required Guid TenantId { get; init; }
        public required string Name { get; init; }
        public required string Key { get; init; }
        public required string? Description { get; init; }
        public required string? Icon { get; init; }
        public required string? Color { get; init; }
        public required string? OwnerId { get; init; }
    }
}
