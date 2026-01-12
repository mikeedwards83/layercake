using Google.Cloud.Firestore;
using LayerCake.Kernel.Firebase.Stores.Queries;
using LayerCake.Kernel.Tenants.LogicalApplications.Queries;

namespace LayerCake.Kernel.Firebase.Stores.LogicalApplications.Queries;

public class GetLogicalApplicationsByProjectFirebaseQueryBuilder : TenantFirestoreQueryBuilder<GetLogicalApplicationsByProjectQuery>
{
    protected override Query InternalBuildQuery(Query query, GetLogicalApplicationsByProjectQuery parameters)
    {
        return query.WhereEqualTo("projectId", parameters.ProjectId.ToString());
    }
}
