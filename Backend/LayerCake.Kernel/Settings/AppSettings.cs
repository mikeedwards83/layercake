namespace LayerCake.Kernel.Settings;

/// <summary>
/// Application settings
/// </summary>
public class AppSettings
{
    public const string SectionName = "App";

    /// <summary>
    /// Base URL of the frontend application
    /// </summary>
    public string BaseUrl { get; set; } = string.Empty;

    /// <summary>
    /// Path for the invite acceptance page
    /// </summary>
    public string InviteUrl { get; set; } = "/invite";
}
