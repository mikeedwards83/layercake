using System;
using System.Collections.Generic;
using System.Text;

namespace LayerCake.Kernel.Store
{
    public interface IRepository<TRecord, TId> where TRecord : IRecord
    {
        Task Add<TRecord>(TRecord record) where TRecord : IRecord, new();
        Task<TRecord> Get(TId id);
        Task Update(TRecord record);
    }
}
