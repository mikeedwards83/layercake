using LayerCake.Kernel.Tenants.Store;

namespace LayerCake.Kernel.Tenants.LogicalApplications;

/// <summary>
/// Represents a logical application entity
/// </summary>
public class LogicalApplication : ITenantRecord
{
    public Guid Id { get; set; }
    public Guid CreatedBy { get; set; }
    public Guid UpdatedBy { get; set; }
    public DateTime Created { get; set; }
    public DateTime Updated { get; set; }

    /// <summary>
    /// Gets or sets the logical application name
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the project ID that this logical application belongs to
    /// </summary>
    public Guid ProjectId { get; set; }

    /// <summary>
    /// Gets or sets the logical application description
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the owner ID of the logical application
    /// </summary>
    public Guid OwnerId { get; set; } = Guid.Empty;

    /// <summary>
    /// Gets or sets the application type ID
    /// </summary>
    public Guid ApplicationTypeId { get; set; } = Guid.Empty;

    public Guid TenantId { get; set; }
}
