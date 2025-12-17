using LayerCake.Kernel.Store;
using LayerCake.Kernel.Store.Tasks;
using LayerCake.Kernel.Tenants.Projects;
using LayerCake.Kernel.Tenants.Wikis;
using LayerCake.Kernel.Tenants.Wikis.Queries;
using Microsoft.Extensions.DependencyInjection;

namespace LayerCake.Kernel.Firebase.Stores.Projects.Tasks;

public class ProjectWikiTask(IServiceProvider serviceProvider) 
    : RecordTask<Project>(serviceProvider),
        IRecordTaskAdd<Project>,
        IRecordTaskUpdate<Project>,
        IRecordTaskDelete<Project>

{
    private IWikiPageStore _wikiPageStore = serviceProvider.GetRequiredService<IWikiPageStore>();


    public Task BeforeAdd(RecordTaskContext context)
    {
        return Task.CompletedTask;
    }

    public Task AfterAdd(RecordTaskContext context)
    {
        var project = (Project)context.Record;
        return CreateWikiPage(project);
    }

    public Task BeforeUpdate(RecordTaskContext context)
    {
        return Task.CompletedTask;
    }

    public async Task AfterUpdate(RecordTaskContext context)
    {
        var project = (Project)context.Record;

        var results = await _wikiPageStore.Find(new WikiPageByReferenceAndParentQuery(project.Id, WikiPage.RootParentId, 0,
            1));

        var wikiPage = results.FirstOrDefault();
        
        if (wikiPage == null)
        {
            await CreateWikiPage(project);
        }
        else
        {
            await  _wikiPageStore.Update(wikiPage, x =>
            {
                wikiPage.Title = $"{project.Name} Wiki";
                return Task.CompletedTask;
            });
        }
    }

    private Task CreateWikiPage(Project project)
    {
        return _wikiPageStore.Add(  wikiPage =>
        {
            wikiPage.Title = $"{project.Name} Wiki";
            wikiPage.Contents = $"Start your projects wiki";
            wikiPage.ReferenceId = project.Id;
            wikiPage.ParentId = WikiPage.RootParentId;

            return Task.CompletedTask;
        });
    }

    public Task BeforeDelete(RecordTaskContext context)
    {
        return Task.CompletedTask;
    }

    public async Task AfterDelete(RecordTaskContext context)
    {
        var project = (Project)context.Record;
        var pages = _wikiPageStore.FindAll(new WikiPagesByReferenceQuery(project.Id, 0, 1));
        
        foreach (var page in pages)
        {
            await _wikiPageStore.Delete(page);
        }
    }
}