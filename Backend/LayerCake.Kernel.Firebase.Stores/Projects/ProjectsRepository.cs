using Google.Cloud.Firestore;
using LayerCake.Kernel.Firebase.Stores.Queries;
using LayerCake.Kernel.Tenants.Projects;

namespace LayerCake.Kernel.Firebase.Stores.Projects;

/// <summary>
/// Firebase Firestore implementation of IProjectsRepository
/// </summary>
public class ProjectsRepository(FirestoreDb firestoreDb, IQueryFactory queryFactory)
    : RepositoryBase<Project>("Projects", firestoreDb, queryFactory), IProjectsRepository
{
    protected override Dictionary<string, object> MapAdd(Project record)
    {
        return new Dictionary<string, object>
        {
            { "tenantId", record.TenantId.ToString() },
            { "name", record.Name },
            { "key", record.Key },
            { "description", record.Description },
            { "icon", record.Icon },
            { "color", record.Color },
            { "ownerId", record.OwnerId },
            { "createdAt", FieldValue.ServerTimestamp },
            { "updatedAt", FieldValue.ServerTimestamp }
        };
    }

    protected override Dictionary<string, object> MapUpdate(Project record)
    {
        return new Dictionary<string, object>
        {
            { "name", record.Name },
            { "description", record.Description },
            { "icon", record.Icon },
            { "color", record.Color },
            { "ownerId", record.OwnerId },
            { "updatedAt", FieldValue.ServerTimestamp }
        };
    }

    protected override Project MapToObject(DocumentSnapshot document)
    {
        var data = document.ToDictionary();
        
        return new Project
        {
            Id = Guid.Parse(document.Id),
            TenantId = Guid.Parse(data.GetValueOrDefault("tenantId")?.ToString() ?? Guid.Empty.ToString()),
            Name = data.GetValueOrDefault("name")?.ToString() ?? string.Empty,
            Key = data.GetValueOrDefault("key")?.ToString() ?? string.Empty,
            Description = data.GetValueOrDefault("description")?.ToString() ?? string.Empty,
            Icon = data.GetValueOrDefault("icon")?.ToString() ?? string.Empty,
            Color = data.GetValueOrDefault("color")?.ToString() ?? string.Empty,
            OwnerId = data.GetValueOrDefault("ownerId")?.ToString() ?? string.Empty
        };
    }
    }