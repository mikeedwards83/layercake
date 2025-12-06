using LayerCake.Kernel.Store;
using System;
using System.Collections.Generic;
using System.Text;

namespace LayerCake.Kernel.Tenants
{
    public interface ITenantRecord : IRecord
    {
        public Guid Id { get; set; }
        public Guid TenantId { get; set;  }
    }
}
