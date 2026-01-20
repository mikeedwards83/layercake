using Google.Cloud.Firestore;
using LayerCake.Kernel.Firebase.Stores.Queries;
using LayerCake.Kernel.Tenants.Users;

namespace LayerCake.Kernel.Firebase.Stores.Users;

/// <summary>
/// Firebase Firestore implementation of IUsersRepository
/// </summary>
public class UsersRepository(FirestoreDb firestoreDb, IQueryFactory queryFactory)
    : RepositoryBase<User>("Users", firestoreDb, queryFactory), IUsersRepository
{
    protected override Dictionary<string, object> MapAdd(User record)
    {
        return new Dictionary<string, object>
        {
            { "tenantIds", record.TenantIds.Select(t => t.ToString()).ToArray() },
            { "displayName", record.DisplayName },
            { "initials", record.Initials },
            { "firstName", record.FirstName },
            { "lastName", record.LastName },
            { "email", record.Email },
            { "tenantId", record.TenantId.ToString() },
            { "createdAt", FieldValue.ServerTimestamp },
            { "updatedAt", FieldValue.ServerTimestamp }
        };
    }

    protected override Dictionary<string, object> MapUpdate(User record)
    {
        return new Dictionary<string, object>
        {
            { "tenantIds", record.TenantIds.Select(t => t.ToString()).ToArray() },
            { "displayName", record.DisplayName },
            { "initials", record.Initials },
            { "firstName", record.FirstName },
            { "lastName", record.LastName },
            { "email", record.Email },
            { "updatedAt", FieldValue.ServerTimestamp }
        };
    }

    protected override User MapToObject(DocumentSnapshot document)
    {
        var data = document.ToDictionary();

        var tenantIdsArray = data.GetValueOrDefault("tenantIds") as List<object>;
        var tenantIds = tenantIdsArray?
            .Select(t => Guid.Parse(t.ToString() ?? Guid.Empty.ToString()))
            .ToArray() ?? Array.Empty<Guid>();

        return new User
        {
            Id = Guid.Parse(document.Id),
            TenantIds = tenantIds,
            DisplayName = data.GetValueOrDefault("displayName")?.ToString() ?? string.Empty,
            Initials = data.GetValueOrDefault("initials")?.ToString() ?? string.Empty,
            FirstName = data.GetValueOrDefault("firstName")?.ToString() ?? string.Empty,
            LastName = data.GetValueOrDefault("lastName")?.ToString() ?? string.Empty,
            Email = data.GetValueOrDefault("email")?.ToString() ?? string.Empty,
            TenantId = Guid.Parse(data.GetValueOrDefault("tenantId")?.ToString() ?? Guid.Empty.ToString())
        };
    }
}
