namespace LayerCake.Kernel.Store;

public class RecordPager<TRecord>(IStore<TRecord> store) where TRecord : IRecord
{
    public int BatchSize { get; set; } = 100;
    
    public IEnumerable<TRecord> FindAll(QueryParameters queryParameters)
    {
        queryParameters.Skip = 0;
        queryParameters.Take = BatchSize;
        throw new NotImplementedException("Not implemented because of Firebase weirdness");
    }
}