using Google.Cloud.Firestore;
using LayerCake.Kernel.Firebase.Stores.Queries;
using LayerCake.Kernel.Tenants.LogicalApplications.Queries;

namespace LayerCake.Kernel.Firebase.Stores.LogicalApplications.Queries;

public class GetAllLogicalApplicationsFirebaseQueryBuilder : TenantFirestoreQueryBuilder<GetAllLogicalApplicationsQuery>
{
    protected override Query InternalBuildQuery(Query query, GetAllLogicalApplicationsQuery parameters)
    {
        // No additional filters needed - just return all logical applications for the tenant
        // The tenant filter is already applied by the base TenantFirestoreQueryBuilder
        return query;
    }
}
