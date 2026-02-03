using LayerCake.Api.Areas.AdminArea.Controllers.Users.Models;
using LayerCake.Kernel.Tenants.Users;

namespace LayerCake.Api.Areas.AuthenticationArea.Controllers.Users.Models;

public class RegistrationResponse
{
    public UserResponse User { get; set; } = null!;
    public string CustomToken { get; set; } = string.Empty;

    public static RegistrationResponse Map(User user, string customToken)
    {
        return new RegistrationResponse
        {
            User = UserResponse.Map(user),
            CustomToken = customToken
        };
    }
}
