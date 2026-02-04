namespace LayerCake.Kernel.Tenants.Containers.Queries;

public class GetContainersByLogicalApplicationQuery(Guid logicalApplicationId, int skip, int take) : TenantQueryParameters(skip, take)
{
    public Guid LogicalApplicationId { get; } = logicalApplicationId;
}
