using System.Reflection;
using LayerCake.Kernel.Settings;
using Microsoft.Extensions.Options;

namespace LayerCake.Kernel.Email;

/// <summary>
/// Builds invite email messages
/// </summary>
public class InviteEmailBuilder
{
    private readonly AppSettings _appSettings;
    private readonly string _inviteEmailTemplate;

    public InviteEmailBuilder(IOptions<AppSettings> appSettings)
    {
        _appSettings = appSettings.Value;
        _inviteEmailTemplate = LoadEmbeddedTemplate("LayerCake.Kernel.Email.Templates.InviteEmail.html");
    }

    public EmailMessage BuildInviteEmail(string toEmail, string inviteToken, string invitedByName)
    {
        var inviteLink = $"{_appSettings.BaseUrl}{_appSettings.InviteUrl}?token={inviteToken}";

        var body = _inviteEmailTemplate
            .Replace("{{InviteLink}}", inviteLink)
            .Replace("{{InvitedByName}}", invitedByName);

        return new EmailMessage
        {
            To = toEmail,
            Subject = "You are invited to Layer Cake",
            Body = body,
            IsHtml = true
        };
    }

    private static string LoadEmbeddedTemplate(string resourceName)
    {
        var assembly = Assembly.GetExecutingAssembly();

        using var stream = assembly.GetManifestResourceStream(resourceName);
        if (stream == null)
        {
            throw new InvalidOperationException($"Embedded resource '{resourceName}' not found.");
        }

        using var reader = new StreamReader(stream);
        return reader.ReadToEnd();
    }
}
