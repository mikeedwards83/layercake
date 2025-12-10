using Google.Cloud.Firestore;
using LayerCake.Kernel.Firebase.Stores.Queries;
using LayerCake.Kernel.Tenants.Projects.Queries;

namespace LayerCake.Kernel.Firebase.Stores.Projects.Queries;

public class GetAllProjectsFirebaseQueryBuilder : TenantFirestoreQueryBuilder<GetAllProjectsQuery>
{
    protected override Query InternalBuildQuery(Query query, GetAllProjectsQuery parameters)
    {
        // No additional filters needed - just return all projects for the tenant
        // The tenant filter is already applied by the base TenantFirestoreQueryBuilder
        return query;
    }
}
