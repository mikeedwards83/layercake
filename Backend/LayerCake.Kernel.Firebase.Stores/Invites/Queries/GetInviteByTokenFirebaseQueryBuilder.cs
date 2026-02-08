using Google.Cloud.Firestore;
using LayerCake.Kernel.Firebase.Stores.Queries;
using LayerCake.Kernel.Tenants.Invites;

namespace LayerCake.Kernel.Firebase.Stores.Invites.Queries;

public class GetInviteByTokenFirebaseQueryBuilder : FirestoreQueryBuilder<GetInviteByTokenQuery>
{
    protected override Query InternalBuildQuery(CollectionReference collection, GetInviteByTokenQuery parameters)
    {
        return collection.WhereEqualTo("token", parameters.Token);
    }
}
