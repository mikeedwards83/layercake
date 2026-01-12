namespace LayerCake.Kernel.Tenants.LogicalApplications.Queries;

public class GetLogicalApplicationsByProjectQuery(Guid projectId, int skip, int take) : TenantQueryParameters(skip, take)
{
    public Guid ProjectId { get; } = projectId;
}
