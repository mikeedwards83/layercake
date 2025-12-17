using LayerCake.Kernel.Tenants.Store;

namespace LayerCake.Kernel.Tenants.Wikis;

/// <summary>
/// Represents a wiki page entity
/// </summary>
public class WikiPage : ITenantRecord
{
    public static Guid RootParentId { get; } = Guid.Empty;
    
    private string _key = string.Empty;

    public Guid Id { get; set; }

    public Guid TenantId { get; set; }

    /// <summary>
    /// Gets or sets the title of the wiki page (max 100 characters)
    /// </summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the key used in the URL to identify the page
    /// This is the first 50 characters of the Title with hyphens for spaces and lowercased
    /// </summary>
    public string Key
    {
        get => _key;
        set => _key = value.ToLowerInvariant();
    }

    /// <summary>
    /// Gets or sets the contents of the wiki page to display (max 20000 characters)
    /// </summary>
    public string Contents { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the ID of the component/container/element in the system that "owns" this wiki page
    /// </summary>
    public Guid ReferenceId { get; set; }

    /// <summary>
    /// Gets or sets the ID of the parent wiki page
    /// If the Guid is an empty Guid then the page is the root page
    /// </summary>
    public Guid ParentId { get; set; }

    /// <summary>
    /// Gets or sets the date and time the page was last updated
    /// </summary>
    public DateTime Updated { get; set; }

    /// <summary>
    /// Gets or sets the ID of the user who last updated the page
    /// </summary>
    public Guid UpdatedBy { get; set; }

    /// <summary>
    /// Gets or sets the date and time the page was created
    /// </summary>
    public DateTime Created { get; set; }

    /// <summary>
    /// Gets or sets the ID of the user who created the page
    /// </summary>
    public Guid CreatedBy { get; set; }
}
