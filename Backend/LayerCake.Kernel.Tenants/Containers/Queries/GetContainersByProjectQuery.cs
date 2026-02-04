namespace LayerCake.Kernel.Tenants.Containers.Queries;

public class GetContainersByProjectQuery(Guid projectId, int skip, int take, string? key = null) : TenantQueryParameters(skip, take)
{
    public Guid ProjectId { get; } = projectId;
    public string? Key { get; } = key?.ToUpperInvariant();
}
