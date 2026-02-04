namespace LayerCake.Kernel.ContainerTypes;

public interface IContainerTypesStore
{
    Task<IEnumerable<ContainerType>> GetAll();
}
