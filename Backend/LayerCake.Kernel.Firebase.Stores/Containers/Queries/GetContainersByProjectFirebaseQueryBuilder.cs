using Google.Cloud.Firestore;
using LayerCake.Kernel.Firebase.Stores.Queries;
using LayerCake.Kernel.Tenants.Containers.Queries;

namespace LayerCake.Kernel.Firebase.Stores.Containers.Queries;

public class GetContainersByProjectFirebaseQueryBuilder : TenantFirestoreQueryBuilder<GetContainersByProjectQuery>
{
    protected override Query InternalBuildQuery(Query query, GetContainersByProjectQuery parameters)
    {
        query = query.WhereEqualTo("projectId", parameters.ProjectId.ToString());

        if (!string.IsNullOrEmpty(parameters.Key))
        {
            query = query.WhereEqualTo("key", parameters.Key);
        }

        return query;
    }
}
