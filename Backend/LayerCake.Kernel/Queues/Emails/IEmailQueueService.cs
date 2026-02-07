using LayerCake.Kernel.Email;

namespace LayerCake.Kernel.Queues.Emails;

/// <summary>
/// Service for queuing emails to be sent asynchronously
/// </summary>
public interface IEmailQueueService
{
    /// <summary>
    /// Queues an email message to be sent in the background
    /// </summary>
    ValueTask QueueEmailAsync(EmailMessage message);
}
