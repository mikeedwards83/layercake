using LayerCake.Kernel.Store;

namespace LayerCake.Kernel.Tenants
{
    public abstract class TenantQueryParameters(int skip, int take) : QueryParameters(skip, take)
    {
        public Guid TenantId { get; set; }
    }
}
