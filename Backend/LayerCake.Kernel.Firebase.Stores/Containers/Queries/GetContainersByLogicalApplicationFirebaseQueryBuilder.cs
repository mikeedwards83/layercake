using Google.Cloud.Firestore;
using LayerCake.Kernel.Firebase.Stores.Queries;
using LayerCake.Kernel.Tenants.Containers.Queries;

namespace LayerCake.Kernel.Firebase.Stores.Containers.Queries;

public class GetContainersByLogicalApplicationFirebaseQueryBuilder : TenantFirestoreQueryBuilder<GetContainersByLogicalApplicationQuery>
{
    protected override Query InternalBuildQuery(Query query, GetContainersByLogicalApplicationQuery parameters)
    {
        query = query.WhereEqualTo("logicalApplicationId", parameters.LogicalApplicationId.ToString());
        return query;
    }
}
