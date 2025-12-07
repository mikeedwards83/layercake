using Google.Cloud.Firestore;
using LayerCake.Kernel.Store;
using LayerCake.Kernel.Tenants;
using LayerCake.Kernel.Tenants.Store;

namespace LayerCake.Kernel.Firebase.Stores.Queries;

/// <summary>
/// Firestore query implementation for retrieving a single record by Id and TenantId
/// </summary>
public class GetQueryBuilder:
    TenantFirestoreQueryBuilder<GetQueryParameters>
{
    protected override void InternalBuildQuery(Query query, GetQueryParameters parameters)
    {
        query.WhereEqualTo("id", parameters.Id.ToString());
    }
}
