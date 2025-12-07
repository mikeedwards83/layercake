using LayerCake.Kernel.Store;

namespace LayerCake.Kernel.Tenants
{
    public abstract class TenantQueryParameters(string queryName, int skip, int take) : QueryParameters(queryName, skip, take)
    {
        public Guid TenantId { get; set; }
    }
}
