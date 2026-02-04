using LayerCake.Kernel.Tenants.Store;

namespace LayerCake.Kernel.Tenants.Containers;

/// <summary>
/// Represents a container entity within a logical application
/// </summary>
public class Container : ITenantRecord
{
    public Guid Id { get; set; }
    public Guid CreatedBy { get; set; }
    public Guid UpdatedBy { get; set; }
    public DateTime Created { get; set; }
    public DateTime Updated { get; set; }
    public Guid TenantId { get; set; }

    /// <summary>
    /// Gets or sets the container name
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the container key (unique identifier within project)
    /// </summary>
    public string Key { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the project ID that this container belongs to
    /// </summary>
    public Guid ProjectId { get; set; }

    /// <summary>
    /// Gets or sets the logical application ID that this container belongs to
    /// </summary>
    public Guid LogicalApplicationId { get; set; }

    /// <summary>
    /// Gets or sets the container description
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the container type ID (references ContainerType)
    /// </summary>
    public int Type { get; set; }

    /// <summary>
    /// Gets or sets the icon name from the icon library
    /// </summary>
    public string Icon { get; set; } = string.Empty;
}
