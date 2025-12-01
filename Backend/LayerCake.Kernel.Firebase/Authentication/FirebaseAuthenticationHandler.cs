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
    private readonly FirebaseApp _firebaseApp;
    private readonly IConfiguration _configuration;

    public FirebaseAuthenticationHandler(
        IOptionsMonitor<JwtBearerOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        IConfiguration configuration) : base(options, logger, encoder)
    {
        _configuration = configuration;

        // Initialize Firebase Admin SDK if not already initialized
        if (FirebaseApp.DefaultInstance == null)
        {
            var projectId = _configuration["Firebase:ProjectId"];
            var credentialPath = _configuration["Firebase:CredentialPath"];

            GoogleCredential credential;

            // Try to load credentials from file path if specified
            if (!string.IsNullOrEmpty(credentialPath) && File.Exists(credentialPath))
            {
                Logger.LogInformation($"Loading Firebase credentials from: {credentialPath}");
                credential = GoogleCredential.FromFile(credentialPath);
            }
            // Try environment variable
            else if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS")))
            {
                var envPath = Environment.GetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS");
                Logger.LogInformation($"Loading Firebase credentials from environment variable: {envPath}");
                credential = GoogleCredential.GetApplicationDefault();
            }
            // Try default location
            else
            {
                try
                {
                    Logger.LogInformation("Attempting to load Firebase credentials from default location");
                    credential = GoogleCredential.GetApplicationDefault();
                }
                catch (Exception ex)
                {
                    Logger.LogError(ex, "Failed to load Firebase credentials. Please set Firebase:CredentialPath in appsettings.json or GOOGLE_APPLICATION_CREDENTIALS environment variable.");
                    throw new InvalidOperationException(
                        "Firebase credentials not found. Please provide credentials via:\n" +
                        "1. Set 'Firebase:CredentialPath' in appsettings.json to point to your service account key file\n" +
                        "2. Set GOOGLE_APPLICATION_CREDENTIALS environment variable\n" +
                        "3. Place credentials in the default application credentials location", ex);
                }
            }

            _firebaseApp = FirebaseApp.Create(new AppOptions()
            {
                Credential = credential,
                ProjectId = projectId
            });

            Logger.LogInformation($"Firebase Admin SDK initialized successfully for project: {projectId}");
        }
        else
        {
            _firebaseApp = FirebaseApp.DefaultInstance;
        }
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
