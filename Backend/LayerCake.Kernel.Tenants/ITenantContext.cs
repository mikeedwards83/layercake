using System;
using System.Collections.Generic;
using System.Text;

namespace LayerCake.Kernel.Tenants
{
    public interface ITenantContext
    {
        public  Guid TenantId { get; set; }
    }

    public class FakeTenantContext : ITenantContext
    {
        public Guid TenantId { get; set; }  = new Guid("00000000-0000-0000-0000-000000000001");
    }
}
