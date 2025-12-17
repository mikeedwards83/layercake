using Google.Cloud.Firestore;
using LayerCake.Kernel.Firebase.Stores.Queries;
using LayerCake.Kernel.Tenants.Wikis.Queries;

namespace LayerCake.Kernel.Firebase.Stores.Wikis.Queries;

public class WikiPagesByReferenceFirebaseQueryBuilder : TenantFirestoreQueryBuilder<WikiPagesByReferenceQuery>
{
    protected override Query InternalBuildQuery(Query query, WikiPagesByReferenceQuery parameters)
    {
        return query.WhereEqualTo("referenceId", parameters.ReferenceId.ToString());
    }
}
