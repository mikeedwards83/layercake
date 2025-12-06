using Google.Cloud.Firestore;
using LayerCake.Kernel.Store;

namespace LayerCake.Kernel.Firebase.Stores.Queries
{
    public interface IQueryFactory
    {
        Query Build(CollectionReference collectionReference, QueryParameters queryParameters);
    }
}
