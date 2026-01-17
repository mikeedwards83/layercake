namespace LayerCake.Api.Controllers.Settings.ApplicationTypes.Models;

public class ApplicationTypesGetResponse
{
    public List<ApplicationTypeResponse> ApplicationTypes { get; set; } = new();
}
