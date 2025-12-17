using FluentValidation;
using LayerCake.Kernel.Store;

namespace LayerCake.Kernel.Tenants.Store
{
    public abstract class TenantStoreBase<TRecord, TId>(
        ITenantContext tenantContext,
        IRepository<TRecord> repository,
        AbstractValidator<TRecord> validator)
        : StoreBase<TRecord, TId>(repository,validator) where TRecord : ITenantRecord, new()
    {
        public override Task<TRecord> Add(Func<TRecord, Task> create)
        {
            return base.Add(async record =>
            {
                await create(record);
                record.Id = Guid.NewGuid();
                record.TenantId = tenantContext.TenantId;
            });
        }

        protected override void ExpandQueryParameters(QueryParameters queryParameters)
        {
            var tenantQueryParameters = queryParameters as TenantQueryParameters ?? throw new NotSupportedException("Must be of type TenantQueryParameters");
            tenantQueryParameters.TenantId = tenantContext.TenantId;
            base.ExpandQueryParameters(queryParameters);
        }
    }
}
