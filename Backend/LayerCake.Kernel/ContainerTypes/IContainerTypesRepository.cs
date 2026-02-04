namespace LayerCake.Kernel.ContainerTypes;

public interface IContainerTypesRepository
{
    Task<IEnumerable<ContainerType>> GetAll();
}
