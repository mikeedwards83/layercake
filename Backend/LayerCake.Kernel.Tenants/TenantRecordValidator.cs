using FluentValidation;
using LayerCake.Kernel.Tenants.Store;

namespace LayerCake.Kernel.Tenants;

/// <summary>
/// Base validator for entities that implement ITenantRecord
/// Validates common tenant record properties
/// </summary>
/// <typeparam name="T">The type of tenant record being validated</typeparam>
public abstract class TenantRecordValidator<T> : AbstractValidator<T> where T : ITenantRecord
{
    protected TenantRecordValidator()
    {
        RuleFor(x => x.TenantId)
            .NotEmpty()
            .WithMessage("Tenant ID is required");

        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Record ID is required");
    }
}
