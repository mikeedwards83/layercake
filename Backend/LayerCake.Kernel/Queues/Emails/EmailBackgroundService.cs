using LayerCake.Kernel.Email;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace LayerCake.Kernel.Queues.Emails;

/// <summary>
/// Background service that processes queued emails
/// </summary>
public class EmailBackgroundService : BackgroundService
{
    private readonly EmailQueueService _queueService;
    private readonly IEmailService _emailService;
    private readonly ILogger<EmailBackgroundService> _logger;

    public EmailBackgroundService(
        EmailQueueService queueService,
        IEmailService emailService,
        ILogger<EmailBackgroundService> logger)
    {
        _queueService = queueService;
        _emailService = emailService;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Email background service is starting");

        await foreach (var message in _queueService.Reader.ReadAllAsync(stoppingToken))
        {
            try
            {
                _logger.LogInformation("Processing queued email to {To}", message.To);
                await _emailService.SendEmailAsync(message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing email to {To}", message.To);
                // Continue processing other emails even if one fails
            }
        }

        _logger.LogInformation("Email background service is stopping");
    }
}
