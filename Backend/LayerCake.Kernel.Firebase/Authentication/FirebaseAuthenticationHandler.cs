using System.Security.Claims;
using System.Text.Encodings.Web;
using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace LayerCake.Kernel.Firebase.Authentication;

public class FirebaseAuthenticationHandler : AuthenticationHandler<JwtBearerOptions>
{
    public FirebaseAuthenticationHandler(
        IOptionsMonitor<JwtBearerOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder
       ) : base(options, logger, encoder)
    {
        
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        // Check if Authorization header exists
        if (!Request.Headers.ContainsKey("Authorization"))
        {
            return AuthenticateResult.Fail("Missing Authorization header");
        }

        string authorizationHeader = Request.Headers["Authorization"].ToString();

        // Check if it's a Bearer token
        if (string.IsNullOrEmpty(authorizationHeader) || !authorizationHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            return AuthenticateResult.Fail("Invalid Authorization header format");
        }

        // Extract the token
        string token = authorizationHeader.Substring("Bearer ".Length).Trim();

        if (string.IsNullOrEmpty(token))
        {
            return AuthenticateResult.Fail("Missing token");
        }

        try
        {
            // Verify the Firebase ID token
            FirebaseToken decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(token);

            // Create claims from the Firebase token
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, decodedToken.Uid),
                new Claim("user_id", decodedToken.Uid),
                new Claim("firebase", "true")
            };

            // Add email claim if available
            if (decodedToken.Claims.TryGetValue("email", out var email))
            {
                claims.Add(new Claim(ClaimTypes.Email, email.ToString()!));
            }

            // Add name claim if available
            if (decodedToken.Claims.TryGetValue("name", out var name))
            {
                claims.Add(new Claim(ClaimTypes.Name, name.ToString()!));
            }

            // Add all other claims from Firebase token
            foreach (var claim in decodedToken.Claims)
            {
                if (claim.Key != "email" && claim.Key != "name")
                {
                    claims.Add(new Claim(claim.Key, claim.Value?.ToString() ?? string.Empty));
                }
            }

            // Create the ClaimsIdentity and ClaimsPrincipal
            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);

            return AuthenticateResult.Success(ticket);
        }
        catch (FirebaseAuthException ex)
        {
            Logger.LogError(ex, "Firebase authentication failed");
            return AuthenticateResult.Fail($"Firebase authentication failed: {ex.Message}");
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Authentication error");
            return AuthenticateResult.Fail($"Authentication error: {ex.Message}");
        }
    }
}
