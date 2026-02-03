using System.Security.Claims;
using LayerCake.Kernel.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace LayerCake.Kernel.Firebase.Authentication;

public class AnonymousUserMiddleware(RequestDelegate next)
{
    private static readonly Guid AnonymousUserId = new("00000000-0000-0000-0000-000000000001");

    public async Task InvokeAsync(HttpContext context, ICurrentUserContext currentUserContext)
    {
        if (!currentUserContext.IsAuthenticated)
        {
            var firebaseContext = (FirebaseCurrentUserContext)currentUserContext;
            var identity = new ClaimsIdentity();
            var principal = new ClaimsPrincipal(identity);
            firebaseContext.User = new AuthenticatedUser(AnonymousUserId, principal);
        }

        await next(context);
    }
}

public static class AnonymousUserMiddlewareExtensions
{
    public static IApplicationBuilder UseAnonymousUser(this IApplicationBuilder app)
    {
        return app.UseMiddleware<AnonymousUserMiddleware>();
    }
}
