# Data Structures Documentation

## Project Data Structure

The Project entity is a core domain object in the LayerCake system that represents a project within a tenant`s workspace.

### Entity Definition

**Location:** `Backend/LayerCake.Kernel.Tenants/Projects/Project.cs`

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `Id` | `Guid` | Yes | Unique identifier for the project |
| `TenantId` | `Guid` | Yes | Identifier for the tenant that owns this project |
| `Name` | `string` | Yes | Display name of the project (max 100 characters) |
| `Key` | `string` | Yes | Unique key for the project (alphanumeric, hyphens, underscores only, max 50 characters) |
| `Description` | `string` | No | Detailed description of the project (max 500 characters, supports markdown) |
| `Icon` | `string` | No | Icon name from the icon library (max 100 characters) |
| `Color` | `string` | No | Hex color code for the project (format: #RRGGBB) |
| `OwnerId` | `string` | No | User ID of the project owner (max 128 characters) |

## WikiPage Data Structure

### Properties
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `Id` | `Guid` | Yes | Unique identifier for the project |
| `TenantId` | `Guid` | Yes | Identifier for the tenant that owns this project |
| `Title` | string | Yes | The title of the wiki page. (max 100 characters) |
| `Key` | string | Yes | Key | The key used in the URL to identify the page. This is the first 50 characters of the Title with hypens for spaces and lowercased. |
| `Contents` | string | Yes | The contents of the wiki page to display. (max 20000 characters) |
| `ReferenceId` | Guid | Yes | The ID of the component/container/element in the system that "owns" this wiki page |
| `ParentId` | Guid | Yes | The ID of the parent wiki page. If the Guid is an empty Guid then the page is the root page |
| `Updated | DateTime | Yes | The date and time the page was last updated |
| `UpdatedBy` | Guid | Yes | The ID of the user who last updated the page. |
| `Created` | DateTime | Yes | THe date and time the page was created. |
| `CreatedBy` | Guid | Yes | The ID of the user who created the page. |

## Logical Application

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `Id` | `Guid` | Yes | Unique identifier for the project. |
| `TenantId` | `Guid` | Yes | Identifier for the tenant that owns this project. |
| `Name` | string | Yes | The name of the logical application. (max 100 characters) |
| `ProjectId` | Guid | Yes | The ID of the project that this logical application belongs to. |
| `Description` | `string` | No | Detailed description of the project (max 500 characters, supports markdown) |
| `OwnerId` | `string` | No | User ID of the project owner (max 128 characters) |
| `Updated` | DateTime | Yes | The date and time the page was last updated |
| `UpdatedBy` | Guid | Yes | The ID of the user who last updated the page. |
| `Created` | DateTime | Yes | THe date and time the page was created. |
| `CreatedBy` | Guid | Yes | The ID of the user who created the page. |

## User

The User entity represents a user in the system. Users are stored in both Firebase Authentication and a separate Users database collection. The link between Firebase Auth and the Users database is the user's email address.

**Location:** `Backend/LayerCake.Kernel.Tenants/Users/User.cs`

### Password Requirements

When creating a new user account, the password must meet the following requirements:
- **Minimum Length**: 8 characters
- **Lowercase Letter**: At least 1 lowercase letter (a-z)
- **Uppercase Letter**: At least 1 uppercase letter (A-Z)
- **Special Character**: At least 1 special character (!@#$%^&*(),.?":{}|<>)

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `Id` | `Guid` | Yes | Unique identifier for the user. |
| `TenantId` | `Guid` | Yes | Identifier for the tenant (required for ITenantRecord). |
| `TenantIds` | `Guid[]` | Yes | Array of tenants the user is a member of. |
| `DisplayName` | `String` | Yes | The user's display name (max 200 characters). |
| `Initials` | `String` | Yes | Initials generated from the user's First Name and Last Name (max 10 characters). |
| `FirstName` | `String` | Yes | The user's first name (max 100 characters). |
| `LastName`| `String` | Yes | The user's last name (max 100 characters). |
| `Email` | `String` | Yes | The user's email address. Must be a valid email address (max 256 characters). |
| `Updated` | `DateTime` | Yes | The date and time the user was last updated. |
| `UpdatedBy` | `Guid` | Yes | The ID of the user who last updated this user record. |
| `Created` | `DateTime` | Yes | The date and time the user was created. |
| `CreatedBy` | `Guid` | Yes | The ID of the user who created this user record. |
| `Status` | `UserStatus` | Yes | The current status of the user (InvitePending=0, EmailPending=1, Completed=2, Disabled=3). |

## Invite

The Invite entity represents a user invitation in the system. Invites are created when an administrator invites a new user to the system and are used to track the invitation lifecycle.

**Location:** `Backend/LayerCake.Kernel.Tenants/Invites/Invite.cs`

### Invitation Lifecycle

1. **Created**: Admin creates an invite for a new user
2. **Sent**: Email with invitation link is sent to the user
3. **Pending**: User has not yet accepted (invitation valid for 2 weeks)
4. **Accepted**: User completes the invitation workflow and sets their password
5. **Expired**: Invitation token expires after 2 weeks

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `Id` | `Guid` | Yes | Unique identifier for the invitation. |
| `UserId` | `Guid` | Yes | The ID of the user being invited. Links to the User entity. |
| `Email` | `String` | Yes | The email address the invitation was sent to. Must be a valid email address. |
| `Token` | `String` | Yes | Unique token for the invitation link. Used in the invitation URL. |
| `ExpiresAt` | `DateTime` | Yes | When the invitation expires. Set to 2 weeks from creation date. Must be in the future. |
| `IsAccepted` | `Boolean` | Yes | Whether the invitation has been accepted. Default: false. |
| `AcceptedAt` | `DateTime?` | No | When the invitation was accepted. Null if not yet accepted. |
| `InvitedByName` | `String` | Yes | Display name of the user who created the invitation. Used in the invitation email. |
| `Updated` | `DateTime` | Yes | The date and time the invitation was last updated. |
| `UpdatedBy` | `Guid` | Yes | The ID of the user who last updated this invitation record. |
| `Created` | `DateTime` | Yes | The date and time the invitation was created. |
| `CreatedBy` | `Guid` | Yes | The ID of the user who created this invitation. |

### Related Workflows

- **Admin Creates User**: Admin fills out form with email, first name, last name → User record created with Status=InvitePending → Invite record created → Email sent with invitation link
- **User Accepts Invite**: User clicks link in email → Views invitation details → Sets password → Account activated → User Status changes to Completed → Invite.IsAccepted set to true
- **Invitation Expiry**: Invitations automatically expire after 2 weeks (ExpiresAt) → Expired invitations cannot be accepted → Admin must create a new invitation
