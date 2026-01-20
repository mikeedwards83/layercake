using Google.Cloud.Firestore;
using LayerCake.Kernel.Firebase.Stores.Queries;
using LayerCake.Kernel.Tenants.Users.Queries;

namespace LayerCake.Kernel.Firebase.Stores.Users.Queries;

public class GetAllUsersFirebaseQueryBuilder : TenantFirestoreQueryBuilder<GetAllUsersQuery>
{
    protected override Query InternalBuildQuery(Query query, GetAllUsersQuery parameters)
    {
        // No additional filters needed - just return all users for the tenant
        // The tenant filter is already applied by the base TenantFirestoreQueryBuilder
        return query;
    }
}
