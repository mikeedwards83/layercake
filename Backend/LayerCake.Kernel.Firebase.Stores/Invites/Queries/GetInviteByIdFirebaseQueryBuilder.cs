using Google.Cloud.Firestore;
using LayerCake.Kernel.Firebase.Stores.Queries;
using LayerCake.Kernel.Tenants.Invites;

namespace LayerCake.Kernel.Firebase.Stores.Invites.Queries;

public class GetInviteByIdFirebaseQueryBuilder : FirestoreQueryBuilder<GetInviteByIdQuery>
{
    protected override Query InternalBuildQuery(CollectionReference collection, GetInviteByIdQuery parameters)
    {
        return collection.WhereEqualTo(FieldPath.DocumentId, parameters.Id.ToString());
    }
}
