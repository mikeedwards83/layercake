using Google.Cloud.Firestore;
using LayerCake.Kernel.Firebase.Stores.Queries;
using LayerCake.Kernel.Store;

namespace LayerCake.Kernel.Firebase.Stores;

public abstract class RepositoryBase<TRecord>(
    string collectionName, 
    FirestoreDb firestoreDb,
    IQueryFactory queryFactory
    ) where TRecord: IRecord
{
    private readonly CollectionReference _collection = firestoreDb.Collection(collectionName);
    
    protected abstract Dictionary<string, object> MapAdd(TRecord record);
    protected abstract Dictionary<string, object> MapUpdate(TRecord record);
    protected abstract TRecord MapToObject(DocumentSnapshot data);
    
    public async Task Add(TRecord record)
    {
        if (record == null)
            throw new ArgumentNullException(nameof(record));

        var docRef = _collection.Document(record.Id.ToString());

        var data = MapAdd(record);
        var result = await docRef.SetAsync(data);
    }

    public async Task Delete(TRecord record)
    {
        if (record == null)
            throw new ArgumentNullException(nameof(record));

        var docRef = _collection.Document(record.Id.ToString());
        await docRef.DeleteAsync();
    }
    
    public async Task<IEnumerable<TRecord>> Find(QueryParameters queryParameters)
    {
        var query = queryFactory.Build(_collection, queryParameters);
        var snapshot = await query.GetSnapshotAsync();

        var records = new  List<TRecord>();
        
        foreach (var document in snapshot)
        {
            var record = MapToObject(document);
            records.Add(record);
        }

        return records;
    }
    
    public async Task Update(TRecord record)
    {
        if (record == null)
            throw new ArgumentNullException(nameof(record));

        var docRef = _collection.Document(record.Id.ToString());

        var updates = MapUpdate(record);

        await docRef.UpdateAsync(updates);
    }
    
    
}