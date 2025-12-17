using Google.Cloud.Firestore;
using LayerCake.Kernel.Firebase.Stores.Queries;
using LayerCake.Kernel.Tenants.Wikis;

namespace LayerCake.Kernel.Firebase.Stores.Wikis;

/// <summary>
/// Firebase Firestore implementation of IWikiPageRepository
/// </summary>
public class WikiPageRepository(FirestoreDb firestoreDb, IQueryFactory queryFactory)
    : RepositoryBase<WikiPage>("WikiPages", firestoreDb, queryFactory), IWikiPageRepository
{
    protected override Dictionary<string, object> MapAdd(WikiPage record)
    {
        return new Dictionary<string, object>
        {
            { "tenantId", record.TenantId.ToString() },
            { "title", record.Title },
            { "key", record.Key },
            { "contents", record.Contents },
            { "referenceId", record.ReferenceId.ToString() },
            { "parentId", record.ParentId.ToString() },
            { "updated", Timestamp.FromDateTime(record.Updated.ToUniversalTime()) },
            { "updatedBy", record.UpdatedBy.ToString() },
            { "created", Timestamp.FromDateTime(record.Created.ToUniversalTime()) },
            { "createdBy", record.CreatedBy.ToString() },
            { "createdAt", FieldValue.ServerTimestamp },
            { "updatedAt", FieldValue.ServerTimestamp }
        };
    }

    protected override Dictionary<string, object> MapUpdate(WikiPage record)
    {
        return new Dictionary<string, object>
        {
            { "title", record.Title },
            { "key", record.Key },
            { "contents", record.Contents },
            { "parentId", record.ParentId.ToString() },
            { "updated", Timestamp.FromDateTime(record.Updated.ToUniversalTime()) },
            { "updatedBy", record.UpdatedBy.ToString() },
            { "updatedAt", FieldValue.ServerTimestamp }
        };
    }

    protected override WikiPage MapToObject(DocumentSnapshot document)
    {
        var data = document.ToDictionary();

        return new WikiPage
        {
            Id = Guid.Parse(document.Id),
            TenantId = Guid.Parse(data.GetValueOrDefault("tenantId")?.ToString() ?? Guid.Empty.ToString()),
            Title = data.GetValueOrDefault("title")?.ToString() ?? string.Empty,
            Key = data.GetValueOrDefault("key")?.ToString() ?? string.Empty,
            Contents = data.GetValueOrDefault("contents")?.ToString() ?? string.Empty,
            ReferenceId = Guid.Parse(data.GetValueOrDefault("referenceId")?.ToString() ?? Guid.Empty.ToString()),
            ParentId = Guid.Parse(data.GetValueOrDefault("parentId")?.ToString() ?? Guid.Empty.ToString()),
            Updated = ParseTimestamp(data.GetValueOrDefault("updated")),
            UpdatedBy = Guid.Parse(data.GetValueOrDefault("updatedBy")?.ToString() ?? Guid.Empty.ToString()),
            Created = ParseTimestamp(data.GetValueOrDefault("created")),
            CreatedBy = Guid.Parse(data.GetValueOrDefault("createdBy")?.ToString() ?? Guid.Empty.ToString())
        };
    }

    private static DateTime ParseTimestamp(object? timestampObj)
    {
        if (timestampObj is Timestamp timestamp)
        {
            return timestamp.ToDateTime();
        }
        return DateTime.UtcNow;
    }
}
