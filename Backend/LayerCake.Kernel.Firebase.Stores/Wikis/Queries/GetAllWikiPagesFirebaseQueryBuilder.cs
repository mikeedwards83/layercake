using Google.Cloud.Firestore;
using LayerCake.Kernel.Firebase.Stores.Queries;
using LayerCake.Kernel.Tenants.Wikis.Queries;

namespace LayerCake.Kernel.Firebase.Stores.Wikis.Queries;

public class GetAllWikiPagesFirebaseQueryBuilder : TenantFirestoreQueryBuilder<GetAllWikiPagesQuery>
{
    protected override Query InternalBuildQuery(Query query, GetAllWikiPagesQuery parameters)
    {
        // No additional filters needed - just return all wikis for the tenant
        // The tenant filter is already applied by the base TenantFirestoreQueryBuilder
        return query;
    }
}
