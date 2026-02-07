using System.Threading.Channels;
using LayerCake.Kernel.Email;
using Microsoft.Extensions.Logging;

namespace LayerCake.Kernel.Queues.Emails;

/// <summary>
/// Channel-based implementation of email queue service
/// </summary>
public class EmailQueueService : IEmailQueueService
{
    private readonly Channel<EmailMessage> _channel;
    private readonly ILogger<EmailQueueService> _logger;

    public EmailQueueService(ILogger<EmailQueueService> logger)
    {
        _logger = logger;
        // Create an unbounded channel for email messages
        _channel = Channel.CreateUnbounded<EmailMessage>(new UnboundedChannelOptions
        {
            SingleReader = true,
            SingleWriter = false
        });
    }

    /// <summary>
    /// Gets the channel reader for the background service to consume
    /// </summary>
    public ChannelReader<EmailMessage> Reader => _channel.Reader;

    public async ValueTask QueueEmailAsync(EmailMessage message)
    {
        if (message == null)
            throw new ArgumentNullException(nameof(message));

        _logger.LogInformation("Queuing email to {To} with subject: {Subject}", message.To, message.Subject);

        await _channel.Writer.WriteAsync(message);
    }
}
