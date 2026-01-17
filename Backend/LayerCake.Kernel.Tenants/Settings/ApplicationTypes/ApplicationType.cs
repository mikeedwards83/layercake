using LayerCake.Kernel.Tenants.Store;

namespace LayerCake.Kernel.Tenants.Settings.ApplicationTypes;

/// <summary>
/// Represents an application type entity
/// </summary>
public class ApplicationType : ITenantRecord
{
    public Guid Id { get; set; }
    public Guid CreatedBy { get; set; }
    public Guid UpdatedBy { get; set; }
    public DateTime Created { get; set; }
    public DateTime Updated { get; set; }

    /// <summary>
    /// Gets or sets the application type name
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets whether this is a custom type (user-created)
    /// </summary>
    public bool IsCustom { get; set; }

    public Guid TenantId { get; set; }
}
