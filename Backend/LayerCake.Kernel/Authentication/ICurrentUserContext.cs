namespace LayerCake.Kernel.Authentication;

public interface ICurrentUserContext
{
    public AuthenticatedUser User { get; }

    public bool IsAuthenticated { get; }

    void Authenticate(Guid userId);
}