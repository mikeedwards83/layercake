using Google.Cloud.Firestore;
using LayerCake.Kernel.Firebase.Stores.Queries;
using LayerCake.Kernel.Tenants.Invites;

namespace LayerCake.Kernel.Firebase.Stores.Invites;

/// <summary>
/// Firebase Firestore implementation of IInvitesRepository
/// </summary>
public class InvitesRepository(FirestoreDb firestoreDb, IQueryFactory queryFactory)
    : RepositoryBase<Invite>("Invites", firestoreDb, queryFactory), IInvitesRepository
{
    protected override Dictionary<string, object> MapAdd(Invite record)
    {
        return new Dictionary<string, object>
        {
            { "userId", record.UserId.ToString() },
            { "email", record.Email },
            { "token", record.Token },
            { "expiresAt", Timestamp.FromDateTime(record.ExpiresAt.ToUniversalTime()) },
            { "isAccepted", record.IsAccepted },
            { "acceptedAt", record.AcceptedAt.HasValue ? Timestamp.FromDateTime(record.AcceptedAt.Value.ToUniversalTime()) : null! },
            { "invitedByName", record.InvitedByName },
            { "createdBy", record.CreatedBy.ToString() },
            { "createdAt", FieldValue.ServerTimestamp },
            { "updatedAt", FieldValue.ServerTimestamp }
        };
    }

    protected override Dictionary<string, object> MapUpdate(Invite record)
    {
        return new Dictionary<string, object>
        {
            { "isAccepted", record.IsAccepted },
            { "acceptedAt", record.AcceptedAt.HasValue ? Timestamp.FromDateTime(record.AcceptedAt.Value.ToUniversalTime()) : null! },
            { "updatedAt", FieldValue.ServerTimestamp }
        };
    }

    protected override Invite MapToObject(DocumentSnapshot document)
    {
        var data = document.ToDictionary();

        DateTime? acceptedAt = null;
        if (data.GetValueOrDefault("acceptedAt") is Timestamp acceptedTimestamp)
        {
            acceptedAt = acceptedTimestamp.ToDateTime();
        }

        var expiresAt = DateTime.UtcNow.AddDays(14);
        if (data.GetValueOrDefault("expiresAt") is Timestamp expiresTimestamp)
        {
            expiresAt = expiresTimestamp.ToDateTime();
        }

        var createdAt = DateTime.UtcNow;
        if (data.GetValueOrDefault("createdAt") is Timestamp createdTimestamp)
        {
            createdAt = createdTimestamp.ToDateTime();
        }

        var updatedAt = DateTime.UtcNow;
        if (data.GetValueOrDefault("updatedAt") is Timestamp updatedTimestamp)
        {
            updatedAt = updatedTimestamp.ToDateTime();
        }

        return new Invite
        {
            Id = Guid.Parse(document.Id),
            UserId = Guid.Parse(data.GetValueOrDefault("userId")?.ToString() ?? Guid.Empty.ToString()),
            Email = data.GetValueOrDefault("email")?.ToString() ?? string.Empty,
            Token = data.GetValueOrDefault("token")?.ToString() ?? string.Empty,
            ExpiresAt = expiresAt,
            IsAccepted = data.GetValueOrDefault("isAccepted") is bool accepted && accepted,
            AcceptedAt = acceptedAt,
            InvitedByName = data.GetValueOrDefault("invitedByName")?.ToString() ?? string.Empty,
            CreatedBy = Guid.Parse(data.GetValueOrDefault("createdBy")?.ToString() ?? Guid.Empty.ToString()),
            Created = createdAt,
            Updated = updatedAt
        };
    }
}
