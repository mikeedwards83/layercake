using LayerCake.Kernel.Store;

namespace LayerCake.Kernel.Tenants.Invites;

public class GetInviteByTokenQuery : QueryParameters
{
    public string Token { get; }

    public GetInviteByTokenQuery(string token)
    {
        Token = token;
    }
}
