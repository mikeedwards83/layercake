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

## Container Application

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `Id` | `Guid` | Yes | Unique identifier for the project. |
| `TenantId` | `Guid` | Yes | Identifier for the tenant that owns this project. |
| `Name` | string | Yes | The name of the logical application. (max 100 characters) |
| `ProjectId` | Guid | Yes | The ID of the project that this logical application belongs to. |
| `Description` | `string` | No | Detailed description of the project (max 500 characters, supports markdown) |
| `Type` | `int` | Yes | An enum that defines the type of container. See Container Type list. |
| `Updated` | DateTime | Yes | The date and time the page was last updated |
| `UpdatedBy` | Guid | Yes | The ID of the user who last updated the page. |
| `Created` | DateTime | Yes | THe date and time the page was created. |
| `CreatedBy` | Guid | Yes | The ID of the user who created the page. |
| `Icon` | `string` | No | Icon name from the icon library (max 100 characters) |


## Container to Logical Application Link

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `Id` | `Guid` | Yes | Unique identifier for the project. |
| `TenantId` | `Guid` | Yes | Identifier for the tenant that owns this project. |
| `LogicalApplicationId` | `Guid` | Yes | Identifier for the logical application that contains the Container. |
| `Containr` | `Guid` | Yes | Identifier for the container linked to the logical application. |



# Lists

## Container Type
| Name | Description |
|---|----|
| Relational DB | A relational database system (SQL Server, PostgreSQL, MySQL, Oracle) that stores structured data in tables with relationships |
| Document DB | A NoSQL document database (MongoDB, Firestore, Cosmos DB) that stores data as JSON-like documents |
| Key-Value Store | A simple NoSQL database (Redis, DynamoDB) that stores data as key-value pairs for fast lookups |
| Web App | A web application that runs in a browser, typically built with frameworks like React, Angular, or Vue |
| Mobile App | A native or hybrid mobile application for iOS, Android, or cross-platform frameworks |
| Desktop App | A desktop application for Windows, macOS, or Linux platforms |
| Cache | An in-memory caching layer (Redis, Memcached) for improving performance and reducing database load |
| Message Queue | A message broker or queue system (RabbitMQ, Kafka, Azure Service Bus) for asynchronous communication |
| Internal API | A REST or GraphQL API used internally within the organization, not exposed to external consumers |
| External API | A public or partner-facing API that provides services to external consumers |
| SaaS | A third-party Software-as-a-Service platform integrated into the system (Stripe, Auth0, SendGrid) |
| File Storage | A file or blob storage service (AWS S3, Azure Blob Storage, Google Cloud Storage) for storing unstructured data |
| Serverless Function | A function-as-a-service component (AWS Lambda, Azure Functions, Google Cloud Functions) that runs code on demand |
| Container Runtime | A containerized application running on Docker, Kubernetes, or similar orchestration platforms |
| Event Stream | A streaming data platform (Kafka, EventHub, Kinesis) for real-time event processing |
| Search Engine | A dedicated search service (Elasticsearch, Azure Cognitive Search, Algolia) for full-text search capabilities |
| Analytics DB | A data warehouse or analytics database (Snowflake, BigQuery, Redshift) optimized for analytical queries |
| CDN | A Content Delivery Network that caches and serves static assets globally |
| Gateway | An API gateway or reverse proxy (Kong, Nginx, Azure API Management) that routes and manages API traffic |
| Authentication Service | A dedicated authentication and authorization service (Firebase Auth, Auth0, Keycloak) |

