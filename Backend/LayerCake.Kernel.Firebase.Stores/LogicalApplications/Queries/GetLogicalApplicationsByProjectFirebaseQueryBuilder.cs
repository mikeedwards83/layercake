using Google.Cloud.Firestore;
using LayerCake.Kernel.Firebase.Stores.Queries;
using LayerCake.Kernel.Tenants.LogicalApplications.Queries;

namespace LayerCake.Kernel.Firebase.Stores.LogicalApplications.Queries;

public class GetLogicalApplicationsByProjectFirebaseQueryBuilder : TenantFirestoreQueryBuilder<GetLogicalApplicationsByProjectQuery>
{
    protected override Query InternalBuildQuery(Query query, GetLogicalApplicationsByProjectQuery parameters)
    {
        query = query.WhereEqualTo("projectId", parameters.ProjectId.ToString());

        if (!string.IsNullOrEmpty(parameters.Key))
        {
            query = query.WhereEqualTo("key", parameters.Key);
        }

        return query;
    }
}
