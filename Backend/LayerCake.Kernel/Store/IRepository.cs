using System;
using System.Collections.Generic;
using System.Text;

namespace LayerCake.Kernel.Store
{
    public interface IRepository<TRecord, TId> where TRecord : IRecord
    {
        Task Add(TRecord record) ;
        Task Delete(TRecord record);
        Task<IEnumerable<TRecord>> Find(QueryParameters query);
        Task Update(TRecord record);
    }
}
