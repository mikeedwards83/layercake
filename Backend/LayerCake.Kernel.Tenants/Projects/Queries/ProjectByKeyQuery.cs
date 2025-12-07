using System;
using System.Collections.Generic;
using System.Text;

namespace LayerCake.Kernel.Tenants.Projects.Queries
{
    public class ProjectByKeyQuery(string projectKey, int skip, int take) : TenantQueryParameters(nameof(ProjectByKeyQuery), skip, take)
    {
        public string ProjectKey { get; } = projectKey;
    }
}
