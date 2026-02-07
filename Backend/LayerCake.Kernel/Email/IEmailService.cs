namespace LayerCake.Kernel.Email;

/// <summary>
/// Service for sending emails
/// </summary>
public interface IEmailService
{
    Task SendEmailAsync(EmailMessage message);
}
