namespace Records.Tasks;

public interface IRecordTask<TRecord> where TRecord: IRecord
{
}

public interface IAdd<TRecord>:IRecordTask<TRecord> where TRecord: IRecord
{
    Task OnBefore(TaskContext<TRecord> context);
    Task OnAfter(TaskContext<TRecord> context);
}
