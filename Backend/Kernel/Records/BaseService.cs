using Records.Tasks;

namespace Records;
public abstract class BaseService<TId, TRecord>(
    IStore store,
    List<IRecordTask<IRecord>> tasks
    ) where TRecord : IRecord
{
    public async Task<IRecord> Get(TId id)
    {
        
    }

    public async Task RunTask<IRecordTask>(TaskContext<TRecord> taskContext, Type taskType)
    {
        if(task)
    }
}