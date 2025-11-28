namespace Records.Tasks;

public class TaskContext<TRecord> where TRecord: IRecord
{
    public TRecord? Record { get; set; }
}