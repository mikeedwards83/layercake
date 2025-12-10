using Google.Cloud.Firestore;
using LayerCake.Kernel.Firebase.Stores.Queries;
using LayerCake.Kernel.Tenants.Projects.Queries;

namespace LayerCake.Kernel.Firebase.Stores.Projects.Queries;

public class ProjectByKeyFirebaseQueryBuilder: TenantFirestoreQueryBuilder<ProjectByKeyQuery>
{
    protected override void InternalBuildQuery(Query query, ProjectByKeyQuery parameters)
    {
        query.WhereEqualTo("key", parameters.ProjectKey);
    }
}