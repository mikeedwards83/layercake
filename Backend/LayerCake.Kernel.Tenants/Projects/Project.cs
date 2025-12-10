using FluentValidation.Results;
using LayerCake.Kernel.Store;
using LayerCake.Kernel.Tenants.Store;

namespace LayerCake.Kernel.Tenants.Projects;

/// <summary>
/// Represents a project entity
/// </summary>
public class Project : ITenantRecord
{
    private string _key = string.Empty;
    
    public Guid Id { get; set; }
    /// <summary>
    /// Gets or sets the project name
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the project key (unique identifier, max 10 characters, uppercase alphanumeric)
    /// </summary>
    public string Key { 
        get => _key;
        set => _key = value.ToUpperInvariant();
    } 

    /// <summary>
    /// Gets or sets the project description
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the project icon
    /// </summary>
    public string Icon { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the project color (hex color code)
    /// </summary>
    public string Color { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the owner ID of the project
    /// </summary>
    public string OwnerId { get; set; } = string.Empty;

    public Guid TenantId { get; set; }
  
}
