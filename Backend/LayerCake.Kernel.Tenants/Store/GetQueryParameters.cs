namespace LayerCake.Kernel.Tenants.Store;

public class GetQueryParameters(Guid id) 
    : TenantQueryParameters(nameof(GetQueryParameters), 0, 1)
{
    public Guid Id { get; } = id;
}