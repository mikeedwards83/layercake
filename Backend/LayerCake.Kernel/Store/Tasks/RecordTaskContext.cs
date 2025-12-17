namespace LayerCake.Kernel.Store.Tasks;

public class RecordTaskContext
{
    public IRecord Record { get; set; }

    public RecordTaskContext(IRecord record)
    {
        Record = record;
    }
}