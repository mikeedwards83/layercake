using Google.Cloud.Firestore;
using LayerCake.Kernel.Firebase.Stores.Queries;
using LayerCake.Kernel.Store;
using LayerCake.Kernel.Tenants.Projects;

namespace LayerCake.Kernel.Firebase.Stores;

/// <summary>
/// Firebase Firestore implementation of IProjectsRepository
/// </summary>
public class ProjectsRepository(FirestoreDb firestoreDb, IQueryFactory queryFactory) 
    : IProjectsRepository
{
    private readonly CollectionReference _collection = firestoreDb.Collection(CollectionName);
    private const string CollectionName = "projects";

    public async Task Add(Project record)
    {
        if (record == null)
            throw new ArgumentNullException(nameof(record));

        var validationResult = record.Validate();
        if (!validationResult.IsValid)
            throw new InvalidOperationException($"Project validation failed: {string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage))}");

        var docRef = _collection.Document(record.Id.ToString());
        
        var projectData = new Dictionary<string, object>
        {
            { "id", record.Id.ToString() },
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

        await docRef.SetAsync(projectData);
    }

    public async Task Delete(Project record)
    {
        if (record == null)
            throw new ArgumentNullException(nameof(record));

        var docRef = _collection.Document(record.Id.ToString());
        await docRef.DeleteAsync();
    }

    public async Task<IEnumerable<Project>> Find(QueryParameters queryParameters)
    {
        var query = queryFactory.Build(_collection, queryParameters);
        var snapshot = await query.GetSnapshotAsync();

        var records = new  List<Project>();
        
        foreach (var document in snapshot)
        {
            var record =   MapToProject(document);
            records.Add(record);
        }

        return records;
    }

    public async Task Update(Project record)
    {
        if (record == null)
            throw new ArgumentNullException(nameof(record));

        var validationResult = record.Validate();
        if (!validationResult.IsValid)
            throw new InvalidOperationException($"Project validation failed: {string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage))}");

        var docRef = _collection.Document(record.Id.ToString());

        var updates = new Dictionary<string, object>
        {
            { "name", record.Name },
            { "key", record.Key },
            { "description", record.Description },
            { "icon", record.Icon },
            { "color", record.Color },
            { "ownerId", record.OwnerId },
            { "updatedAt", FieldValue.ServerTimestamp }
        };

        await docRef.UpdateAsync(updates);
    }

    private static Project MapToProject(DocumentSnapshot snapshot)
    {
        var data = snapshot.ToDictionary();

        return new Project
        {
            Id = Guid.Parse(data.GetValueOrDefault("id")?.ToString() ?? snapshot.Id),
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
