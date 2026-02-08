using LayerCake.Kernel.Store;

namespace LayerCake.Kernel.Tenants.Invites;

public class GetInviteByTokenQuery : QueryParameters
{
    public string Token { get; }

    public GetInviteByTokenQuery(string token) : base(0, 1)
    {
        Token = token;
    }
}
