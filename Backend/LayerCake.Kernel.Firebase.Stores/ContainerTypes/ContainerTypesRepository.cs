using Google.Cloud.Firestore;
using LayerCake.Kernel.ContainerTypes;

namespace LayerCake.Kernel.Firebase.Stores.ContainerTypes;

/// <summary>
/// Firebase Firestore implementation of IContainerTypesRepository
/// </summary>
public class ContainerTypesRepository(FirestoreDb firestoreDb) : IContainerTypesRepository
{
    private CollectionReference Collection => firestoreDb.Collection("ContainerTypes");

    private ContainerType MapToObject(DocumentSnapshot document)
    {
        var data = document.ToDictionary();

        return new ContainerType
        {
            Id = int.TryParse(document.Id, out var id) ? id : 0,
            Name = data.GetValueOrDefault("name")?.ToString() ?? string.Empty,
            Description = data.GetValueOrDefault("description")?.ToString() ?? string.Empty
        };
    }

    public async Task<IEnumerable<ContainerType>> GetAll()
    {
        var snapshot = await Collection.GetSnapshotAsync();
        return snapshot.Documents.Select(MapToObject).OrderBy(ct => ct.Name).ToList();
    }
}
