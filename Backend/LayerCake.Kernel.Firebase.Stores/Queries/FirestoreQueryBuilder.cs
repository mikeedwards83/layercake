using Google.Cloud.Firestore;
using LayerCake.Kernel.Store;
using LayerCake.Kernel.Tenants;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace LayerCake.Kernel.Firebase.Stores.Queries
{
    public abstract class FirestoreQueryBuilderBase
    {
        public Type QueryParameterType { get; protected set; }
        public abstract Query BuildQuery(CollectionReference collectionReference, QueryParameters parameters);
    }
    
    
    public abstract class FirestoreQueryBuilder<TParameters>
        : FirestoreQueryBuilderBase  
        where TParameters : QueryParameters
    {
        public FirestoreQueryBuilder()
        {
            QueryParameterType = typeof(TParameters);
        }
        
        public override Query BuildQuery(CollectionReference collectionReference, QueryParameters parameters)
        {
            return BuildQuery(collectionReference, (TParameters)parameters);
        }

        public Query BuildQuery(CollectionReference collectionReference, TParameters parameters)
        {
            if (parameters.Take > 100 || parameters.Take < 1)
            {
                throw new ArgumentOutOfRangeException(nameof(parameters), "Take must be between 1 and 100");
            }
            var query = InternalBuildQuery(collectionReference, parameters);
            query.Limit(parameters.Take);
            return query;
        }

        protected abstract Query InternalBuildQuery(CollectionReference collection, TParameters parameters);
    }

  
}