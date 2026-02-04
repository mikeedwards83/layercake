namespace LayerCake.Kernel.ContainerTypes;

/// <summary>
/// Store for managing ContainerType entities (non-tenant specific)
/// </summary>
public class ContainerTypesStore(IContainerTypesRepository repository) : IContainerTypesStore
{
    public async Task<IEnumerable<ContainerType>> GetAll()
    {
        return await repository.GetAll();
    }
}
