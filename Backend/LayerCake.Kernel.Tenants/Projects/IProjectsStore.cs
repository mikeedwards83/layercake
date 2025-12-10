using LayerCake.Kernel.Store;

namespace LayerCake.Kernel.Tenants.Projects;

public interface IProjectsStore
{
    Task<Project?> Get(Guid id);
    Task<Project> Add(Func<Project, Task> create);
    Task<Project> Update(Project record, Func<Project, Task> update);
    Task Delete(Project record);
    Task<IEnumerable<Project>> Find(QueryParameters queryParameters);
}