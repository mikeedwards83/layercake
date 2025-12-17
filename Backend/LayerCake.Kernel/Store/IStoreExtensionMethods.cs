namespace LayerCake.Kernel.Store;

public static class IStoreExtensionMethods
{
    public static IEnumerable<TRecord> FindAll<TRecord> (this IStore<TRecord> store, QueryParameters queryParameters) 
        where TRecord : IRecord
    {
        var recordPager = new RecordPager<TRecord>(store);
        return recordPager.FindAll(queryParameters);
    }
}