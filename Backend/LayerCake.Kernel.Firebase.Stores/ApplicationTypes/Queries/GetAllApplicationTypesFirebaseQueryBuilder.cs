using Google.Cloud.Firestore;
using LayerCake.Kernel.Firebase.Stores.Queries;
using LayerCake.Kernel.Tenants.Settings.ApplicationTypes.Queries;

namespace LayerCake.Kernel.Firebase.Stores.ApplicationTypes.Queries;

public class GetAllApplicationTypesFirebaseQueryBuilder : TenantFirestoreQueryBuilder<GetAllApplicationTypesQuery>
{
    protected override Query InternalBuildQuery(Query query, GetAllApplicationTypesQuery parameters)
    {
        // Return all application types for the tenant, ordered by name
        return query.OrderBy("name");
    }
}
