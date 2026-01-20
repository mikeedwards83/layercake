using FluentValidation;

namespace LayerCake.Kernel.Tenants.Users;

/// <summary>
/// Validator for the User domain model
/// </summary>
public class UserValidator : TenantRecordValidator<User>
{
    public UserValidator(IServiceProvider serviceProvider)
    {
        RuleFor(u => u.DisplayName)
            .NotEmpty()
            .WithMessage("Display name is required")
            .MaximumLength(200)
            .WithMessage("Display name must not exceed 200 characters");

        RuleFor(u => u.FirstName)
            .NotEmpty()
            .WithMessage("First name is required")
            .MaximumLength(100)
            .WithMessage("First name must not exceed 100 characters");

        RuleFor(u => u.LastName)
            .NotEmpty()
            .WithMessage("Last name is required")
            .MaximumLength(100)
            .WithMessage("Last name must not exceed 100 characters");

        RuleFor(u => u.Email)
            .NotEmpty()
            .WithMessage("Email is required")
            .EmailAddress()
            .WithMessage("Email must be a valid email address")
            .MaximumLength(256)
            .WithMessage("Email must not exceed 256 characters");

        RuleFor(u => u.Initials)
            .NotEmpty()
            .WithMessage("Initials are required")
            .MaximumLength(10)
            .WithMessage("Initials must not exceed 10 characters");

        RuleFor(u => u.TenantIds)
            .NotNull()
            .WithMessage("TenantIds is required");
    }
}
