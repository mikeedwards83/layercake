using Google.Cloud.Firestore;
using LayerCake.Kernel.Firebase.Stores.Queries;
using LayerCake.Kernel.Tenants.Settings.ApplicationTypes;

namespace LayerCake.Kernel.Firebase.Stores.ApplicationTypes;

/// <summary>
/// Firebase Firestore implementation of IApplicationTypesRepository
/// </summary>
public class ApplicationTypesRepository(FirestoreDb firestoreDb, IQueryFactory queryFactory)
    : RepositoryBase<ApplicationType>("ApplicationTypes", firestoreDb, queryFactory), IApplicationTypesRepository
{
    protected override Dictionary<string, object> MapAdd(ApplicationType record)
    {
        return new Dictionary<string, object>
        {
            { "tenantId", record.TenantId.ToString() },
            { "name", record.Name },
            { "isCustom", record.IsCustom },
            { "createdAt", FieldValue.ServerTimestamp },
            { "updatedAt", FieldValue.ServerTimestamp }
        };
    }

    protected override Dictionary<string, object> MapUpdate(ApplicationType record)
    {
        return new Dictionary<string, object>
        {
            { "name", record.Name },
            { "isCustom", record.IsCustom },
            { "updatedAt", FieldValue.ServerTimestamp }
        };
    }

    protected override ApplicationType MapToObject(DocumentSnapshot document)
    {
        var data = document.ToDictionary();

        return new ApplicationType
        {
            Id = Guid.Parse(document.Id),
            TenantId = Guid.Parse(data.GetValueOrDefault("tenantId")?.ToString() ?? Guid.Empty.ToString()),
            Name = data.GetValueOrDefault("name")?.ToString() ?? string.Empty,
            IsCustom = bool.Parse(data.GetValueOrDefault("isCustom")?.ToString() ?? "false")
        };
    }
}
