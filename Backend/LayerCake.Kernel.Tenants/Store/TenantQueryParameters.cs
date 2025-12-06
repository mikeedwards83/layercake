using LayerCake.Kernel.Store;

namespace LayerCake.Kernel.Tenants
{
    public abstract class TenantQueryParameters(string name, int skip, int take) : QueryParameters(name, skip, take)
    {
        public Guid TenantId { get; set; }
    }
}
