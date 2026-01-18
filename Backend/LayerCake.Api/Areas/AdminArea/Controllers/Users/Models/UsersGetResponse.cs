namespace LayerCake.Api.Areas.AdminArea.Controllers.Users.Models;

public class UsersGetResponse
{
    public List<UserResponse> Users { get; set; } = new();
}
