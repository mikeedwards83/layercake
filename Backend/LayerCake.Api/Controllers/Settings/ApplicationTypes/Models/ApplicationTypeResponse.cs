using LayerCake.Kernel.Tenants.Settings.ApplicationTypes;

namespace LayerCake.Api.Controllers.Settings.ApplicationTypes.Models;

public class ApplicationTypeResponse
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required bool IsCustom { get; init; }

    public static ApplicationTypeResponse Map(ApplicationType applicationType)
    {
        return new ApplicationTypeResponse
        {
            Id = applicationType.Id,
            Name = applicationType.Name,
            IsCustom = applicationType.IsCustom
        };
    }
}
