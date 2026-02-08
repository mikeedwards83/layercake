using LayerCake.Kernel.Store;

namespace LayerCake.Kernel.Tenants.Invites;

public class GetInviteByIdQuery : QueryParameters
{
    public Guid Id { get; }

    public GetInviteByIdQuery(Guid id) : base(0, 1)
    {
        Id = id;
    }
}
