using Google.Cloud.Firestore;
using LayerCake.Kernel.Store;
using LayerCake.Kernel.Tenants.Store;

namespace LayerCake.Kernel.Firebase.Stores.Queries
{
    public class QueryFactory : IQueryFactory
    {
        Dictionary<string, FirestoreQueryBuilderBase> _builders = new Dictionary<string, FirestoreQueryBuilderBase>
        {
            {
                nameof(GetQueryParameters), new GetQueryBuilder()
            },
            {
                nameof(ProjectByKeyFirebaseQueryBuilder), new ProjectByKeyFirebaseQueryBuilder()
            }
        };

        public  Query Build(CollectionReference collectionReference, QueryParameters queryParameters)
        {
            var builder = _builders[queryParameters.QueryName];
            return builder.BuildQuery(collectionReference, queryParameters);
        }
    }
}