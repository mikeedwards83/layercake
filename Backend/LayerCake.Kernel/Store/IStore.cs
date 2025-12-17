namespace LayerCake.Kernel.Store;

public interface IStore<TRecord> where TRecord: IRecord
{
    Task<TRecord?> Get(Guid id);
    Task<TRecord> Add(Func<TRecord, Task> create);
    Task<TRecord> Update(TRecord record, Func<TRecord, Task> update);
    Task Delete(TRecord record);
    Task<IEnumerable<TRecord>> Find(QueryParameters queryParameters);
}