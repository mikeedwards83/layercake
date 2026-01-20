namespace LayerCake.Kernel.Tenants.LogicalApplications.Queries;

public class GetLogicalApplicationsByProjectQuery(Guid projectId, int skip, int take, string? key = null) : TenantQueryParameters(skip, take)
{
    public Guid ProjectId { get; } = projectId;
    public string? Key { get; } = key?.ToUpperInvariant();
}
