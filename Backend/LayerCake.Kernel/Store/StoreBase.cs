using System;
using System.Collections.Generic;
using System.Text;

namespace LayerCake.Kernel.Store
{
    public class StoreBase<TRecord, TId>(IRepository<TRecord, TId> repository)  where TRecord :IRecord, new()
    {

        public async Task<TRecord> Get(TId id)
        {
            return await repository.Get(id);
        }

        public async Task<TRecord> Add(Func<TRecord, Task> create)
        {
            var record = new TRecord();

            await create(record);

            await repository.Add(record);

            return record;
        }

        public async Task<TRecord> Update(TRecord record, Func<TRecord, Task> update)
        {
            await update(record);

            await repository.Update(record);

            return record;
        }

        public async Task Delete(TRecord record)
        {
            await repository.Delete(record);
        }
    }
}
