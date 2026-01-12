using Google.Cloud.Firestore;
using LayerCake.Kernel.Firebase.Stores.Queries;
using LayerCake.Kernel.Tenants.LogicalApplications;

namespace LayerCake.Kernel.Firebase.Stores.LogicalApplications;

/// <summary>
/// Firebase Firestore implementation of ILogicalApplicationsRepository
/// </summary>
public class LogicalApplicationsRepository(FirestoreDb firestoreDb, IQueryFactory queryFactory)
    : RepositoryBase<LogicalApplication>("LogicalApplications", firestoreDb, queryFactory), ILogicalApplicationsRepository
{
    protected override Dictionary<string, object> MapAdd(LogicalApplication record)
    {
        return new Dictionary<string, object>
        {
            { "tenantId", record.TenantId.ToString() },
            { "name", record.Name },
            { "projectId", record.ProjectId.ToString() },
            { "description", record.Description },
            { "ownerId", record.OwnerId },
            { "createdAt", FieldValue.ServerTimestamp },
            { "updatedAt", FieldValue.ServerTimestamp }
        };
    }

    protected override Dictionary<string, object> MapUpdate(LogicalApplication record)
    {
        return new Dictionary<string, object>
        {
            { "name", record.Name },
            { "description", record.Description },
            { "ownerId", record.OwnerId },
            { "updatedAt", FieldValue.ServerTimestamp }
        };
    }

    protected override LogicalApplication MapToObject(DocumentSnapshot document)
    {
        var data = document.ToDictionary();

        return new LogicalApplication
        {
            Id = Guid.Parse(document.Id),
            TenantId = Guid.Parse(data.GetValueOrDefault("tenantId")?.ToString() ?? Guid.Empty.ToString()),
            Name = data.GetValueOrDefault("name")?.ToString() ?? string.Empty,
            ProjectId = Guid.Parse(data.GetValueOrDefault("projectId")?.ToString() ?? Guid.Empty.ToString()),
            Description = data.GetValueOrDefault("description")?.ToString() ?? string.Empty,
            OwnerId = data.GetValueOrDefault("ownerId")?.ToString() ?? string.Empty
        };
    }
}
