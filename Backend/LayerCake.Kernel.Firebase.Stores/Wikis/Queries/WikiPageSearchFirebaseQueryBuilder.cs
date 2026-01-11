using Google.Cloud.Firestore;
using LayerCake.Kernel.Firebase.Stores.Queries;
using LayerCake.Kernel.Tenants.Wikis.Queries;

namespace LayerCake.Kernel.Firebase.Stores.Wikis.Queries;

/// <summary>
/// Firebase query builder for searching wiki pages by reference ID and title
/// Note: Firestore doesn't support native contains/like operations, so title filtering
/// is done by filtering on referenceId first, then the application layer handles
/// the title search using String.Contains
/// </summary>
public class WikiPageSearchFirebaseQueryBuilder
    : TenantFirestoreQueryBuilder<WikiPageSearchQuery>
{
    protected override Query InternalBuildQuery(Query query, WikiPageSearchQuery parameters)
    {
        // Filter by referenceId first
        query = query
            .WhereEqualTo("referenceId", parameters.ReferenceId.ToString())
            .OrderByDescending("created");

        // Note: Title filtering is handled in the application layer since Firestore
        // doesn't support native contains/like operations. We could implement
        // prefix search using range queries, but for full text search we need
        // to filter results after fetching.

        return query;
    }
}
