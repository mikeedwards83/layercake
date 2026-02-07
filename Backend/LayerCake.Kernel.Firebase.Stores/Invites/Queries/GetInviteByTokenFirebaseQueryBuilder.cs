using Google.Cloud.Firestore;
using LayerCake.Kernel.Firebase.Stores.Queries;
using LayerCake.Kernel.Store;
using LayerCake.Kernel.Tenants.Invites;

namespace LayerCake.Kernel.Firebase.Stores.Invites.Queries;

public class GetInviteByTokenFirebaseQueryBuilder : FirestoreQueryBuilderBase
{
    public override bool CanHandle(QueryParameters queryParameters)
    {
        return queryParameters is GetInviteByTokenQuery;
    }

    public override Query Build(CollectionReference collection, QueryParameters queryParameters)
    {
        var query = (GetInviteByTokenQuery)queryParameters;
        return collection.WhereEqualTo("token", query.Token);
    }
}
