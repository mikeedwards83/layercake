using Google.Cloud.Firestore;
using LayerCake.Kernel.Firebase.Stores.Queries;
using LayerCake.Kernel.Store;
using LayerCake.Kernel.Tenants.Invites;

namespace LayerCake.Kernel.Firebase.Stores.Invites.Queries;

public class GetInviteByIdFirebaseQueryBuilder : FirestoreQueryBuilderBase
{
    public override bool CanHandle(QueryParameters queryParameters)
    {
        return queryParameters is GetInviteByIdQuery;
    }

    public override Query Build(CollectionReference collection, QueryParameters queryParameters)
    {
        var query = (GetInviteByIdQuery)queryParameters;
        return collection.WhereEqualTo(FieldPath.DocumentId, query.Id.ToString());
    }
}
