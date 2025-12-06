using LayerCake.Kernel.Store;

namespace LayerCake.Kernel.Tenants.Store
{
    public abstract class TenantStoreBase<TRecord, TId>(
        ITenantContext tenantContext,
        IRepository<TRecord, TId> repository
        )
        : StoreBase<TRecord, TId>(repository) where TRecord : IRecord, new()
    {
        protected override void ExpandQueryParameters(QueryParameters queryParameters)
        {
            var tenantQueryParameters = queryParameters as TenantQueryParameters ?? throw new NotSupportedException("Must be of type TenantQueryParameters");
            tenantQueryParameters.TenantId = tenantContext.TenantId;
            base.ExpandQueryParameters(queryParameters);
        }
    }
}
