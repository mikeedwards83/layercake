using Google.Cloud.Firestore;
using LayerCake.Kernel.Firebase.Stores.Queries;
using LayerCake.Kernel.Tenants.Wikis.Queries;

namespace LayerCake.Kernel.Firebase.Stores.Wikis.Queries;

public class WikiPageByReferenceAndParentFirebaseQueryBuilder
    : TenantFirestoreQueryBuilder<WikiPageByReferenceAndParentQuery>
{
    protected override Query InternalBuildQuery(Query query, WikiPageByReferenceAndParentQuery parameters)
    {
        return query
            .WhereEqualTo("referenceId", parameters.ReferenceId.ToString())
            .WhereEqualTo("parentId", parameters.ParentId.ToString());
    }
}
