using System.Security.Claims;
using System.Security.Principal;

namespace LayerCake.Kernel.Authentication;

public class AuthenticatedUser(Guid userId, ClaimsPrincipal principal)
{
    public ClaimsPrincipal Principal { get; } = principal;
    public Guid UserId { get; } = userId;
    
    public string Email => GetClaim(ClaimTypes.Email);
    public string Username => GetClaim(ClaimTypes.Email);

    private string GetClaim(string claimName)
    {
        var identity = Principal.Identity as ClaimsIdentity;
        var claim = identity.FindFirst(claimName);
        return claim.Value;
    }
}