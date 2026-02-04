namespace LayerCake.Kernel.ContainerTypes;

/// <summary>
/// Represents a container type (not tenant-specific)
/// </summary>
public class ContainerType
{
    /// <summary>
    /// Gets or sets the unique identifier for the container type
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the name of the container type
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the description of the container type
    /// </summary>
    public string Description { get; set; } = string.Empty;
}
