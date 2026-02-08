using LayerCake.Kernel.Authentication;
using LayerCake.Kernel.Store;
using LayerCake.Kernel.Store.Tasks;

namespace LayerCake.Kernel.Tenants.Invites;

/// <summary>
/// Store for managing Invite entities
/// </summary>
public class InvitesStore : IInvitesStore
{
    private readonly IInvitesRepository _repository;
    private readonly InviteValidator _validator;
    private readonly ICurrentUserContext _currentUserContext;

    public InvitesStore(
        IInvitesRepository repository,
        InviteValidator validator,
        ICurrentUserContext currentUserContext)
    {
        _repository = repository;
        _validator = validator;
        _currentUserContext = currentUserContext;
    }

    public async Task<Invite> Add(Func<Invite, Task> create)
    {
        var invite = new Invite
        {
            Id = Guid.NewGuid(),
            Created = DateTime.UtcNow,
            Updated = DateTime.UtcNow,
            CreatedBy = _currentUserContext.User?.UserId ?? Guid.Empty,
            UpdatedBy = _currentUserContext.User?.UserId ?? Guid.Empty
        };

        await create(invite);

        var validationResult = await _validator.ValidateAsync(invite);
        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        await _repository.Add(invite);
        return invite;
    }

    public async Task<Invite?> Get(Guid id)
    {
        var results = await _repository.Find(new GetInviteByIdQuery(id));
        return results.FirstOrDefault();
    }

    public async Task<IEnumerable<Invite>> Find(QueryParameters query)
    {
        return await _repository.Find(query);
    }

    public async Task<Invite> Update(Invite invite, Func<Invite, Task> update)
    {
        await update(invite);
        invite.Updated = DateTime.UtcNow;
        invite.UpdatedBy = _currentUserContext.User?.UserId ?? Guid.Empty;
        await _repository.Update(invite);
        return invite;
    }

    public async Task Delete(Invite invite)
    {
        await _repository.Delete(invite);
    }
}

public class ValidationException : Exception
{
    public IList<FluentValidation.Results.ValidationFailure> Errors { get; }

    public ValidationException(IList<FluentValidation.Results.ValidationFailure> errors)
        : base("Validation failed")
    {
        Errors = errors;
    }
}
