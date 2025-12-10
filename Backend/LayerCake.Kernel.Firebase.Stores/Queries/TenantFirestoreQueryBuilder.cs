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

        return InternalBuildQuery(query, parameters);
    }

    protected abstract Query InternalBuildQuery(Query query, TParameters parameters);
}