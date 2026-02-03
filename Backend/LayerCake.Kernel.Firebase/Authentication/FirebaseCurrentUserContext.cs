using System.Security.Claims;
using LayerCake.Kernel.Authentication;

namespace LayerCake.Kernel.Firebase.Authentication;

public class FirebaseCurrentUserContext : ICurrentUserContext
{
    public AuthenticatedUser? User { get; internal set;  }
    public bool IsAuthenticated { get; internal set; } = false;

    internal void SetUser(ClaimsPrincipal principal, Guid userId)
    {
        User = new AuthenticatedUser(userId, principal);
        IsAuthenticated = true;
    }

    public void Authenticate(Guid userId)
    {
        var identity = new ClaimsIdentity("Authenticated");
        var principal = new ClaimsPrincipal(identity);
        SetUser(principal, userId);
    }
}