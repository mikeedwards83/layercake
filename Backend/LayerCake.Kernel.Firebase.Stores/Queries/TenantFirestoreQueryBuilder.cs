using Google.Cloud.Firestore;
using LayerCake.Kernel.Tenants;

namespace LayerCake.Kernel.Firebase.Stores.Queries;

public abstract class TenantFirestoreQueryBuilder<TParameters>() 
    : FirestoreQueryBuilder<TParameters>()
    where TParameters: TenantQueryParameters
{
    protected override Query InternalBuildQuery(CollectionReference collection, TParameters parameters)
    {
        var query = collection
            .WhereEqualTo("tenantId", parameters.TenantId.ToString());

        InternalBuildQuery(query, parameters);
        return query;
    }

    protected abstract void InternalBuildQuery(Query query, TParameters parameters);
}