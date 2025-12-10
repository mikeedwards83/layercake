using FluentValidation;

namespace LayerCake.Kernel.Store
{
    public abstract class StoreBase<TRecord, TId>(
            IRepository<TRecord, TId> repository,
            AbstractValidator<TRecord> validator
        )  
        where TRecord :IRecord, new()  
    {
        public async Task<TRecord?> Get(TId id)
        {
            var queryParameters = GetGetQueryParameters(id);
            var results = await Find( queryParameters );
            return results.SingleOrDefault();
        }

        protected abstract QueryParameters GetGetQueryParameters(TId id);


        private async Task Validate(TRecord record)
        {
            var results= await validator.ValidateAsync(record);
            if (!results.IsValid)
            {
                throw new ValidationException(results.Errors);
            }
        }
        public virtual async Task<TRecord> Add(Func<TRecord, Task> create)
        {
            var record = new TRecord();
            
            await create(record);

            await Validate(record);

            await repository.Add(record);

            return record;
        }

        public virtual async Task<TRecord> Update(TRecord record, Func<TRecord, Task> update)
        {
            await update(record);

            await Validate(record);

            await repository.Update(record);

            return record;
        }

        public async Task Delete(TRecord record)
        {
            await repository.Delete(record);
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
    }
}
