namespace LayerCake.Kernel.Tenants.Wikis.Queries;

/// <summary>
/// Query to retrieve all wikis for a tenant
/// </summary>
public class GetAllWikiPagesQuery(int skip, int take) : TenantQueryParameters(skip, take)
{
}
