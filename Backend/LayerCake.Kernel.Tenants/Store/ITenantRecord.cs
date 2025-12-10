using LayerCake.Kernel.Store;

namespace LayerCake.Kernel.Tenants.Store
{
    public interface ITenantRecord : IRecord
    {
        public Guid TenantId { get; set;  }
    }
}
