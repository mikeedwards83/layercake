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
| `Updated` | DateTime | Yes | The date and time the page was last updated |
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

