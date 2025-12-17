using Google.Cloud.Firestore;
using LayerCake.Kernel.Firebase.Stores.Queries;
using LayerCake.Kernel.Tenants.Wikis.Queries;

namespace LayerCake.Kernel.Firebase.Stores.Wikis.Queries;

public class WikiPageByKeyAndReferenceFirebaseQueryBuilder : TenantFirestoreQueryBuilder<WikiPageByKeyAndReferenceQuery>
{
    protected override Query InternalBuildQuery(Query query, WikiPageByKeyAndReferenceQuery parameters)
    {
        return query
            .WhereEqualTo("key", parameters.WikiKey)
            .WhereEqualTo("referenceId", parameters.ReferenceId.ToString());
    }
}
