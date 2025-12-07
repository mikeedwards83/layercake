using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Text;
using Google.Api.Gax;
using Google.Cloud.Firestore;

namespace LayerCake.Kernel.Firebase
{
    public static class ServiceCollectionExtension
    {
        public static void AddFirebase(this IServiceCollection services, bool useEmulator = false)
        {
            if (useEmulator)
            {
                EnableEmulator();
            }
            
            services.AddSingleton<FirebaseApp>(CreateFirebaseApp);
            services.AddSingleton<FirestoreDb>(provider => CreateFirestoreDb(provider, useEmulator));
        }

        private static void EnableEmulator()
        {
            Environment.SetEnvironmentVariable("FIRESTORE_EMULATOR_HOST", "localhost:8080");
            Environment.SetEnvironmentVariable("FIREBASE_AUTH_EMULATOR_HOST", "localhost:9099");
            Environment.SetEnvironmentVariable("FIREBASE_STORAGE_EMULATOR_HOST", "localhost:9199");
        }

        private static FirestoreDb CreateFirestoreDb(IServiceProvider serviceProvider, bool useEmulator)
        {
            var logger = serviceProvider.GetRequiredService<ILogger<FirestoreDb>>();
            
            var firebaseApp =  serviceProvider.GetRequiredService<FirebaseApp>();
            
            FirestoreDb db = new FirestoreDbBuilder { 
                ProjectId =  firebaseApp.Options.ProjectId,
                EmulatorDetection = useEmulator ? EmulatorDetection.EmulatorOnly : EmulatorDetection.None,
            }.Build();

            return db;
        }

        private static FirebaseApp CreateFirebaseApp(IServiceProvider provider)
        {
            var logger = provider.GetRequiredService<ILogger<FirebaseApp>>();
            var configuration = provider.GetRequiredService<IConfiguration>();

            var projectId = configuration["Firebase:ProjectId"];
            var credentialPath = configuration["Firebase:CredentialPath"];

            GoogleCredential credential;

            // Try to load credentials from file path if specified
            if (!string.IsNullOrEmpty(credentialPath) && File.Exists(credentialPath))
            {
                logger.LogInformation($"Loading Firebase credentials from: {credentialPath}");
                credential = GoogleCredential.FromFile(credentialPath);
            }
            // Try environment variable
            else if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS")))
            {
                var envPath = Environment.GetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS");
                logger.LogInformation($"Loading Firebase credentials from environment variable: {envPath}");
                credential = GoogleCredential.GetApplicationDefault();
            }
            // Try default location
            else
            {
                try
                {
                    logger.LogInformation("Attempting to load Firebase credentials from default location");
                    credential = GoogleCredential.GetApplicationDefault();
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Failed to load Firebase credentials. Please set Firebase:CredentialPath in appsettings.json or GOOGLE_APPLICATION_CREDENTIALS environment variable.");
                    throw new InvalidOperationException(
                        "Firebase credentials not found. Please provide credentials via:\n" +
                        "1. Set 'Firebase:CredentialPath' in appsettings.json to point to your service account key file\n" +
                        "2. Set GOOGLE_APPLICATION_CREDENTIALS environment variable\n" +
                        "3. Place credentials in the default application credentials location", ex);
                }
            }

            var firebaseApp = FirebaseApp.Create(new AppOptions()
            {
                Credential = credential,
                ProjectId = projectId
            });

            logger.LogInformation($"Firebase Admin SDK initialized successfully for project: {projectId}");

            return firebaseApp; 
        }
    }
}
