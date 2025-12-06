using System;
using System.Collections.Generic;
using System.Text;

namespace LayerCake.Kernel.Tenants
{
    public interface ITenantContext
    {
        public  Guid TenantId { get; set; }
    }
}
