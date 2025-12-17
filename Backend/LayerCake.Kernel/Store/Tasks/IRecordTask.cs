namespace LayerCake.Kernel.Store.Tasks;

public interface IRecordTask<TRecord> where TRecord : IRecord
{
}

public abstract class RecordTask<TRecord>(IServiceProvider serviceProvider) : IRecordTask<TRecord> where TRecord : IRecord
{
}


public interface IRecordTaskAdd<TRecord> : IRecordTask<TRecord>where TRecord : IRecord
{
    Task BeforeAdd(RecordTaskContext context);
    Task AfterAdd(RecordTaskContext context);
}

public interface IRecordTaskUpdate<TRecord>: IRecordTask<TRecord>where TRecord : IRecord
{
    Task BeforeUpdate(RecordTaskContext context);
    Task AfterUpdate(RecordTaskContext context);
}

public interface IRecordTaskDelete<TRecord>: IRecordTask<TRecord>where TRecord : IRecord
{
    Task BeforeDelete(RecordTaskContext context);
    Task AfterDelete(RecordTaskContext context);
}

public enum RecordTaskType
{
    Add,
    Update,
    Delete
}