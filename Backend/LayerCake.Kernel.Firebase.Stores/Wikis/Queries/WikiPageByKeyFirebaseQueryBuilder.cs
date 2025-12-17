using Google.Cloud.Firestore;
using LayerCake.Kernel.Firebase.Stores.Queries;
using LayerCake.Kernel.Tenants.Wikis.Queries;

namespace LayerCake.Kernel.Firebase.Stores.Wikis.Queries;

public class WikiPageByKeyFirebaseQueryBuilder : TenantFirestoreQueryBuilder<WikiPageByKeyQuery>
{
    protected override Query InternalBuildQuery(Query query, WikiPageByKeyQuery parameters)
    {
        return query.WhereEqualTo("key", parameters.WikiKey);
    }
}
