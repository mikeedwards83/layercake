using LayerCake.Kernel.Store;

namespace LayerCake.Kernel.Tenants.Wikis;

public interface IWikiPageStore
{
    Task<WikiPage?> Get(Guid id);
    Task<WikiPage> Add(Func<WikiPage, Task> create);
    Task<WikiPage> Update(WikiPage record, Func<WikiPage, Task> update);
    Task Delete(WikiPage record);
    Task<IEnumerable<WikiPage>> Find(QueryParameters queryParameters);
}
