# Firebase Authentication Setup Guide

This guide explains how to set up Firebase authentication for the LayerCake.Api application.

## Prerequisites

- .NET 10.0 SDK installed
- Firebase project created (Project ID: archflow-3ca69)
- Firebase service account credentials

## Quick Setup (Recommended)

### 1. Download Firebase Service Account Key

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project (archflow-3ca69)
3. Go to **Project Settings** > **Service Accounts**
4. Click **Generate New Private Key**
5. Save the JSON file

### 2. Place Credentials in Project

**Easiest Option:** Place the downloaded JSON file in the `Backend/LayerCake.Api` directory and rename it to `firebase-credentials.json`

The `appsettings.Development.json` is already configured to look for this file:

```json
{
  "Firebase": {
    "CredentialPath": "firebase-credentials.json"
  }
}
```

**Important:** The `.gitignore` should exclude `firebase-credentials.json` to prevent committing secrets. Add this line to `.gitignore`:
```
**/firebase-credentials.json
```

### Alternative Setup Options

If you prefer not to place the credentials file in the project directory, you can use one of these methods:

#### Option A: Environment Variable

Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable:

**Windows (PowerShell):**
```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\your\serviceAccountKey.json"
```

**Windows (Command Prompt):**
```cmd
set GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\your\serviceAccountKey.json
```

**Linux/macOS:**
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/serviceAccountKey.json"
```

#### Option B: Absolute Path in appsettings

Update `appsettings.Development.json` with an absolute path:

```json
{
  "Firebase": {
    "CredentialPath": "C:\\full\\path\\to\\your\\firebase-credentials.json"
  }
}
```

### 3. Credential Loading Priority

The application tries to load credentials in this order:
1. **CredentialPath** in appsettings.json (if specified and file exists)
2. **GOOGLE_APPLICATION_CREDENTIALS** environment variable
3. **Default application credentials** location

### 4. Restore NuGet Packages

```bash
dotnet restore
```

### 5. Run the Application

```bash
dotnet run
```

## Testing Authentication

### From the Frontend

The frontend ApiClient (in `Frontend/src/services/ApiClient.ts`) automatically includes the Firebase token in API requests:

```typescript
import api from "@/services/api";

// This will automatically include the Firebase auth token
const data = await api.get("/weatherforecast");
```

### Manual Testing with cURL

1. Get a Firebase ID token from your frontend application (check browser dev tools)
2. Use it in a cURL request:

```bash
curl -X GET https://localhost:5001/weatherforecast \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN"
```

## How It Works

1. **Frontend**: When a user logs in via Firebase Authentication, the frontend obtains an ID token
2. **API Request**: The ApiClient includes this token in the `Authorization` header as `Bearer <token>`
3. **Backend**: The `FirebaseAuthenticationHandler` intercepts the request:
   - Extracts the token from the Authorization header
   - Validates the token using Firebase Admin SDK
   - Verifies the token signature and expiration
   - Creates a `ClaimsPrincipal` with user information
4. **Authorization**: Controllers marked with `[Authorize]` will only be accessible with valid tokens

## Securing Endpoints

### Require Authentication

Add the `[Authorize]` attribute to controllers or specific actions:

```csharp
[ApiController]
[Route("[controller]")]
[Authorize]  // Requires authentication for all actions
public class WeatherForecastController : ControllerBase
{
    // ...
}
```

### Allow Anonymous Access

Use `[AllowAnonymous]` for specific actions that don't require authentication:

```csharp
[ApiController]
[Route("[controller]")]
[Authorize]
public class WeatherForecastController : ControllerBase
{
    [HttpGet("public")]
    [AllowAnonymous]  // This action doesn't require authentication
    public IActionResult GetPublicData()
    {
        return Ok("Public data");
    }
}
```

## Accessing User Information

In your controllers, you can access the authenticated user's information:

```csharp
[HttpGet]
public IActionResult Get()
{
    // Get the Firebase user ID
    var userId = User.FindFirst("user_id")?.Value;

    // Get the user's email
    var email = User.FindFirst(ClaimTypes.Email)?.Value;

    // Get the user's name
    var name = User.FindFirst(ClaimTypes.Name)?.Value;

    return Ok(new { userId, email, name });
}
```

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000`

To add more origins, update the CORS configuration in `Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "https://your-production-url.com")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
```

## Troubleshooting

### "Missing Authorization header" Error
- Ensure the frontend is sending the token in the Authorization header
- Check that the token is prefixed with "Bearer "

### "Firebase authentication failed" Error
- Verify the service account credentials are correctly configured
- Check that the token hasn't expired (Firebase ID tokens expire after 1 hour)
- Ensure the Firebase project ID matches in both frontend and backend

### "Authentication required but no user is logged in"
- User must be logged in via Firebase Authentication in the frontend
- Check that `auth.currentUser` is not null

## Production Considerations

1. **Service Account Security**: Never commit service account keys to version control
2. **CORS**: Update CORS origins to match your production frontend URL
3. **HTTPS**: Always use HTTPS in production
4. **Token Refresh**: Implement token refresh logic in the frontend to handle expired tokens
5. **Rate Limiting**: Consider implementing rate limiting to prevent abuse
