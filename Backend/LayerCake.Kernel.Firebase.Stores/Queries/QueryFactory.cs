using Google.Cloud.Firestore;
using LayerCake.Kernel.Store;
using LayerCake.Kernel.Tenants.Store;

namespace LayerCake.Kernel.Firebase.Stores.Queries
{
    public class QueryFactory : IQueryFactory
    {
        private Dictionary<Type, FirestoreQueryBuilderBase> _builders = new();

        public QueryFactory(IEnumerable<FirestoreQueryBuilderBase> builders)
        {
            foreach (var builder in builders)
            {
                _builders.Add(builder.QueryParameterType, builder);
            }
        }

        public  Query Build(CollectionReference collectionReference, QueryParameters queryParameters)
        {
            var builder = _builders[queryParameters.GetType()];
            return builder.BuildQuery(collectionReference, queryParameters);
        }
    }
}