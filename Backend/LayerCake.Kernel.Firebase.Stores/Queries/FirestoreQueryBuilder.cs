using Google.Cloud.Firestore;
using LayerCake.Kernel.Store;
using LayerCake.Kernel.Tenants;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace LayerCake.Kernel.Firebase.Stores.Queries
{
    public abstract class FirestoreQueryBuilder()
    {
        public Query BuildQuery(CollectionReference CollectionReference, QueryParameters parameters)
        {
            if (parameters.Take > 100 || parameters.Take < 1)
            {
                throw new ArgumentOutOfRangeException(nameof(parameters), "Take must be between 1 and 100");
            }
            var query = InternalBuildQuery(CollectionReference, parameters);
            query.Limit(parameters.Take);
            return query;
        }

        protected abstract Query InternalBuildQuery(CollectionReference collection, QueryParameters parameters);
    }

    public abstract class TenantFirestoreQueryBuilder()
        : FirestoreQueryBuilder()
    {
        protected override Query InternalBuildQuery(CollectionReference collection, QueryParameters parameters)
        {
            var tenantQueryParameters = parameters as TenantQueryParameters ??
                                        throw new NotSupportedException("Parameters not of type TenantQueryParameters");

            var query = collection
                .WhereEqualTo("tenantId", tenantQueryParameters.TenantId);

            InternalBuildQuery(query, tenantQueryParameters);

            return query;
        }

        protected abstract void InternalBuildQuery(Query query, TenantQueryParameters parameters);
    }
}