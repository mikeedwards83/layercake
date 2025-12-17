using FluentValidation;
using LayerCake.Kernel.Authentication;
using LayerCake.Kernel.Store.Tasks;

namespace LayerCake.Kernel.Store
{
    public abstract class StoreBase<TRecord, TId>(
        IRepository<TRecord> repository,
        AbstractValidator<TRecord> validator,
        IEnumerable<IRecordTask<TRecord>> recordTasks,
        ICurrentUserContext currentUserContext
        )
        where TRecord : IRecord, new()
    {
        public async Task<TRecord?> Get(TId id)
        {
            var queryParameters = GetGetQueryParameters(id);
            var results = await Find(queryParameters);
            return results.SingleOrDefault();
        }

        protected abstract QueryParameters GetGetQueryParameters(TId id);


        private async Task Validate(TRecord record)
        {
            var results = await validator.ValidateAsync(record);
            if (!results.IsValid)
            {
                throw new ValidationException(results.Errors);
            }
        }

        public virtual async Task<TRecord> Add(Func<TRecord, Task> create)
        {
            
            var record = new TRecord();

            await create(record);

            if (currentUserContext.User == null)
            {
                throw new ValidationException("User not found");
            }

            record.Created = DateTime.UtcNow;
            record.Updated = record.Created;
            record.CreatedBy = currentUserContext.User.UserId;
            record.UpdatedBy = currentUserContext.User.UserId;

            var addTasks = GetTasks<IRecordTaskAdd<TRecord>>();

            var beforeContext = new RecordTaskContext(record);
            var beforeTasks = addTasks.Select(addTask => addTask.BeforeAdd(beforeContext));
            await Task.WhenAll(beforeTasks);
            
            await Validate(record);
            await repository.Add(record);
            
            var afterContext = new RecordTaskContext(record);
            var afterTasks = addTasks.Select(addTask => addTask.AfterAdd(afterContext));
            await Task.WhenAll(afterTasks);

            return record;
        }

        public virtual async Task<TRecord> Update(TRecord record, Func<TRecord, Task> update)
        {
            await update(record);

            
            if (currentUserContext.User == null)
            {
                throw new ValidationException("User not found");
            }
            
            record.Updated = DateTime.UtcNow;
            record.UpdatedBy = currentUserContext.User.UserId;
            
            
            var updateTasks = GetTasks<IRecordTaskUpdate<TRecord>>();

            var beforeContext = new RecordTaskContext(record);
            var beforeTasks = updateTasks.Select(addTask => addTask.BeforeUpdate(beforeContext));
            await Task.WhenAll(beforeTasks);
            
            await Validate(record);
            await repository.Update(record);
            
            var afterContext = new RecordTaskContext(record);
            var afterTasks = updateTasks.Select(addTask => addTask.AfterUpdate(afterContext));
            await Task.WhenAll(afterTasks);

            return record;
        }

        public async Task Delete(TRecord record)
        {
            var deleteTasks = GetTasks<IRecordTaskDelete<TRecord>>();

            var beforeContext = new RecordTaskContext(record);
            var beforeTasks = deleteTasks.Select(addTask => addTask.BeforeDelete(beforeContext));
            await Task.WhenAll(beforeTasks);
            
            await repository.Delete(record);
            
            var afterContext = new RecordTaskContext(record);
            var afterTasks = deleteTasks.Select(addTask => addTask.AfterDelete(afterContext));
            await Task.WhenAll(afterTasks);
            
        }

        public async Task<IEnumerable<TRecord>> Find(QueryParameters queryParameters)
        {
            ExpandQueryParameters(queryParameters);
            return await repository.Find(queryParameters);
        }

        protected virtual void ExpandQueryParameters(QueryParameters queryParameters)
        {
            //does nothing
        }

        private IList<T> GetTasks<T>() where T : class, IRecordTask<TRecord>
        {
            return recordTasks
                .Select(x => x as T)
                .Where(x => x != null)
                .ToList();
        }

      
    }
}