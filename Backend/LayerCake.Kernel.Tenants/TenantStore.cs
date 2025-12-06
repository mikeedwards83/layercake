using LayerCake.Kernel.Store;
using System;
using System.Collections.Generic;
using System.Text;

namespace LayerCake.Kernel.Tenants
{
    public class TenantStore<TRecord, TId>(
        ITenantContext tenantContext,
        IRepository<TRecord, TId> repository)
        : StoreBase<TRecord, TId>(repository) where TRecord : IRecord, new()
    {


    }
}
