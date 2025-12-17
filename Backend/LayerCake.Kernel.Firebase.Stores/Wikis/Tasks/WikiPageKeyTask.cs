using System.Text.RegularExpressions;
using LayerCake.Kernel.Store.Tasks;
using LayerCake.Kernel.Tenants.Wikis;

namespace LayerCake.Kernel.Firebase.Stores.Wikis.Tasks;

public class WikiPageKeyTask(IServiceProvider serviceProvider)
    : RecordTask<WikiPage>(serviceProvider),
        IRecordTaskAdd<WikiPage>,
        IRecordTaskUpdate<WikiPage>
{
    public Task BeforeAdd(RecordTaskContext context)
    {
        var wikiPage = (WikiPage)context.Record;
        wikiPage.Key = GenerateKey(wikiPage.Title);

        return Task.CompletedTask;
    }

    public Task AfterAdd(RecordTaskContext context)
    {
        return Task.CompletedTask;
    }

    public Task BeforeUpdate(RecordTaskContext context)
    {
        var wikiPage = (WikiPage)context.Record;
        wikiPage.Key = GenerateKey(wikiPage.Title);
        return Task.CompletedTask;
    }

    public Task AfterUpdate(RecordTaskContext context)
    {
        return Task.CompletedTask;
    }

    private string GenerateKey(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            return string.Empty;
        }

        // Convert to lowercase
        var key = title.ToLowerInvariant();

        // Remove all non-alphanumeric characters except spaces
        key = Regex.Replace(key, @"[^a-z0-9\s]", string.Empty);

        // Replace spaces with dashes
        key = Regex.Replace(key, @"\s+", "-");

        // Remove leading/trailing dashes
        key = key.Trim('-');

        return key;
    }
}