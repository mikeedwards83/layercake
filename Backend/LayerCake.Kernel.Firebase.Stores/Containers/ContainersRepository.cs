using Google.Cloud.Firestore;
using LayerCake.Kernel.Firebase.Stores.Queries;
using LayerCake.Kernel.Tenants.Containers;

namespace LayerCake.Kernel.Firebase.Stores.Containers;

/// <summary>
/// Firebase Firestore implementation of IContainersRepository
/// </summary>
public class ContainersRepository(FirestoreDb firestoreDb, IQueryFactory queryFactory)
    : RepositoryBase<Container>("Containers", firestoreDb, queryFactory), IContainersRepository
{
    protected override Dictionary<string, object> MapAdd(Container record)
    {
        return new Dictionary<string, object>
        {
            { "tenantId", record.TenantId.ToString() },
            { "name", record.Name },
            { "key", record.Key },
            { "projectId", record.ProjectId.ToString() },
            { "logicalApplicationId", record.LogicalApplicationId.ToString() },
            { "description", record.Description },
            { "type", record.Type },
            { "icon", record.Icon },
            { "createdAt", FieldValue.ServerTimestamp },
            { "updatedAt", FieldValue.ServerTimestamp }
        };
    }

    protected override Dictionary<string, object> MapUpdate(Container record)
    {
        return new Dictionary<string, object>
        {
            { "name", record.Name },
            { "description", record.Description },
            { "type", record.Type },
            { "icon", record.Icon },
            { "updatedAt", FieldValue.ServerTimestamp }
        };
    }

    protected override Container MapToObject(DocumentSnapshot document)
    {
        var data = document.ToDictionary();

        return new Container
        {
            Id = Guid.Parse(document.Id),
            TenantId = Guid.Parse(data.GetValueOrDefault("tenantId")?.ToString() ?? Guid.Empty.ToString()),
            Name = data.GetValueOrDefault("name")?.ToString() ?? string.Empty,
            Key = data.GetValueOrDefault("key")?.ToString() ?? string.Empty,
            ProjectId = Guid.Parse(data.GetValueOrDefault("projectId")?.ToString() ?? Guid.Empty.ToString()),
            LogicalApplicationId = Guid.Parse(data.GetValueOrDefault("logicalApplicationId")?.ToString() ?? Guid.Empty.ToString()),
            Description = data.GetValueOrDefault("description")?.ToString() ?? string.Empty,
            Type = int.TryParse(data.GetValueOrDefault("type")?.ToString(), out var type) ? type : 0,
            Icon = data.GetValueOrDefault("icon")?.ToString() ?? string.Empty
        };
    }
}
