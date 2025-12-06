using Google.Cloud.Firestore;
using LayerCake.Kernel.Store;
using LayerCake.Kernel.Tenants.Store;

namespace LayerCake.Kernel.Firebase.Stores.Queries
{
    public class QueryFactory : IQueryFactory
    {
        Dictionary<string, FirestoreQueryBuilder> _builders = new Dictionary<string, FirestoreQueryBuilder>
        {
            { nameof(GetQueryParameters), new GetQueryBuilder() }
        };

        public  Query Build(CollectionReference collectionReference, QueryParameters queryParameters)
        {
            var builder = _builders[queryParameters.Name];
            return builder.BuildQuery(collectionReference, queryParameters);
        }
    }
}