# Claude Development Guide

This document provides guidelines for Claude AI instances working on this C4 (Context, Containers, Components, Code) architecture management project.

## Project Overview

This is a full-stack application for managing software architecture documentation using the C4 model. The project consists of:
- **Backend**: ASP.NET Core Web API (.NET 8.0)
- **Frontend**: React + TypeScript with Vite
- **Authentication**: Firebase Authentication
- **Database**: SQL Server (assumed from .NET backend)

## Project Structure

```
C:\C4\Src\
├── Backend\
│   └── LayerCake.Api\          # ASP.NET Core Web API
│       ├── Areas\              # Feature-based organization
│       ├── Controllers\        # API controllers
│       └── Program.cs          # Application entry point
├── Frontend\
│   └── src\
│       ├── assets\             # Static assets (images, SCSS)
│       ├── components\         # Reusable React components
│       ├── context\            # React Context providers
│       ├── layouts\            # Layout components
│       ├── routes\             # Route configuration
│       ├── services\           # API client services
│       ├── site\               # Page components (file-based routing pattern)
│       └── types\              # TypeScript type definitions
└── Claude.md                   # This file
```

## Technology Stack

### Frontend
- **Framework**: React 19.2.0 with TypeScript 5.9.3
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router 7.9.6
- **UI Library**: React Bootstrap 2.10.10 (Bootstrap 5.3.8)
- **Authentication**: Firebase 10.14.1 + FirebaseUI 6.1.0
- **Rich Text Editor**: Slate 0.120.0
- **Styling**: Sass 1.94.2
- **Icons**: React Icons 5.5.0 (Tabler Icons)
- **Dev Server**: Port 5174

### Backend
- **Framework**: ASP.NET Core (.NET 8.0)
- **API Style**: RESTful Web API

## Development Patterns & Best Practices

### Frontend Development

#### 1. Component Organization
- Place reusable components in `Frontend/src/components/`
- Place page-specific components in `Frontend/src/site/[feature]/components/`
- Follow the existing folder structure (feature-based organization)

#### 2. Routing
- All routes are defined centrally in `Frontend/src/routes/index.tsx`
- Use lazy loading for route components: `const Component = lazy(() => import('@/site/path'))`
- Authenticated routes must be wrapped in `<AuthenticatedLayout />`
- Anonymous routes (like sign-in) go in the `anonRoutes` array
- Use the `@/` path alias for imports (configured in Vite)

**Route Configuration Pattern:**
```typescript
const authRoutes: RouteObject[] = [
  {
    element: <AuthenticatedLayout />,
    children: [
      {path: "/feature", element: <FeatureComponent />},
      {path: "/feature/:id", element: <FeatureDetailComponent />},
    ],
  },
]
```

#### 3. Navigation Menu
- Menu items are configured in `Frontend/src/layouts/components/data.ts`
- Two menu configurations exist: `menuItems` (vertical sidebar) and `horizontalMenuItems`
- Always add new pages to both menu structures if they should appear in navigation
- Use Tabler Icons from `react-icons/tb` for menu icons

**Menu Item Pattern:**
```typescript
{
  key: 'unique-key',
  label: 'Display Name',
  icon: TbIconName,
  url: '/path'
}
```

#### 4. State Management
- Use React Context API (not Redux or other libraries)
- Available contexts:
  - `AuthContext` - Authentication state and user session
  - `ErrorContext` - Global error handling
  - `LayoutContext` - Layout configuration
  - `NotificationContext` - Toast notifications
  - `KanbanContext` - Kanban/board state (optional)

#### 5. API Integration
- All API calls go through service clients in `Frontend/src/services/`
- Base API client is in `Frontend/src/services/ApiClient.ts`
- Automatically injects Firebase auth tokens
- Supports GET, POST, PUT, PATCH, DELETE methods

**API Client Pattern:**
```typescript
import { ApiClient } from '@/services/ApiClient'

export class FeatureApiClient {
  private apiClient: ApiClient

  constructor() {
    this.apiClient = new ApiClient()
  }

  async getItems() {
    return this.apiClient.get<ItemType[]>('/api/feature')
  }

  async createItem(data: CreateItemDto) {
    return this.apiClient.post<ItemType>('/api/feature', data)
  }
}
```

#### 6. Form Handling
- Use React Bootstrap form components
- Custom form components are available in `Frontend/src/components/Form/`:
  - `TextInput` - Text input with validation
  - `TextArea` - Multi-line text input
  - `ColorPicker` - Color selection
  - `IconSelector` - Icon selection
  - `RichText` - Slate-based rich text editor
  - `UserSelector` - User selection

#### 7. Multi-Step Workflows
- Use the Workflow component from `Frontend/src/components/Workflow/`
- See examples in `Frontend/src/site/projects/add/` and `Frontend/src/site/projects/logical/add/`
- Workflow steps are separate components in a `steps/` subfolder

#### 8. Styling
- Use Bootstrap utility classes first
- Custom styles go in SCSS files in `Frontend/src/assets/scss/`
- Follow the existing naming conventions
- The project uses Bootstrap 5.3.8 utilities

#### 9. TypeScript
- Always use TypeScript, never plain JavaScript
- Define types in `Frontend/src/types/` for shared types
- Use interfaces for component props
- Avoid `any` type - use proper typing

#### 10. Component Patterns
- Use functional components with hooks (not class components)
- Use `PageMetaData` component for setting page titles
- Use `PageBreadcrumb` for breadcrumb navigation (if needed)
- Error boundaries are configured at the layout level

### Backend Development

#### 1. API Structure
- Use ASP.NET Core Web API controllers
- Follow RESTful conventions
- Use Areas for feature-based organization (if adding new features)
- Controllers should be in `Backend/LayerCake.Api/Controllers/` or `Backend/LayerCake.Api/Areas/[FeatureName]/`

#### 2. API Response Patterns
- Return appropriate HTTP status codes
- Use consistent response models
- Handle validation errors with 400 Bad Request
- Include meaningful error messages

#### 3. Authentication
- Frontend uses Firebase Authentication
- Backend should validate Firebase tokens (if not already implemented)
- Protected endpoints should require authentication

### Git Workflow

#### Working with Worktrees
- This project may use git worktrees for parallel development
- Always check current branch: `git branch`
- Commit messages should be descriptive and follow conventional commit format
- Always include co-author tag:
  ```
  Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
  ```

#### Commit Best Practices
- Use present tense: "Add feature" not "Added feature"
- Be specific about what changed and why
- Reference issue numbers if applicable
- Keep commits focused on a single concern

### Common Tasks

#### Adding a New Page

1. **Create the page component** in `Frontend/src/site/[feature]/`
2. **Add the route** in `Frontend/src/routes/index.tsx`:
   - Import with lazy loading
   - Add to authRoutes or anonRoutes
3. **Add to navigation** in `Frontend/src/layouts/components/data.ts`:
   - Add to `menuItems` array
   - Add to `horizontalMenuItems` array (if applicable)
4. **Create API service** (if needed) in `Frontend/src/services/[feature]/`
5. **Add TypeScript types** (if needed) in `Frontend/src/types/`

#### Adding a New API Endpoint

1. **Create controller** in `Backend/LayerCake.Api/Controllers/` or appropriate Area
2. **Create service client** in `Frontend/src/services/[feature]/`
3. **Define TypeScript types** for request/response in `Frontend/src/types/`
4. **Use the service** in your React components

#### Adding a Multi-Step Workflow

1. **Create workflow folder** in `Frontend/src/site/[feature]/add/`
2. **Create main workflow component** (e.g., `featureAddWorkflow.tsx`)
3. **Create steps folder** with individual step components
4. **Use Workflow component** from `Frontend/src/components/Workflow/`
5. **Create review components** in `Frontend/src/components/Review/` (if needed)

### Testing

- Frontend dev server: `cd Frontend && npm run dev`
- Frontend build: `cd Frontend && npm run build`
- Frontend lint: `cd Frontend && npm run lint`
- Backend run: `cd Backend/LayerCake.Api && dotnet run`

### Important Notes

#### Do Not
- ❌ Create new files unnecessarily - prefer editing existing files
- ❌ Add markdown documentation files unless explicitly requested
- ❌ Use emojis unless explicitly requested
- ❌ Use class components - use functional components with hooks
- ❌ Skip TypeScript types - always use proper typing
- ❌ Hardcode API URLs - use the ApiClient base configuration
- ❌ Create duplicate menu items - check existing menu structure first
- ❌ Use inline styles - use Bootstrap utilities or SCSS
- ❌ Import from 'react-bootstrap' without checking existing patterns

#### Always
- ✅ Use the Read tool before editing files
- ✅ Follow existing code patterns and conventions
- ✅ Use lazy loading for route components
- ✅ Add proper TypeScript types
- ✅ Use Bootstrap utility classes for styling
- ✅ Use Tabler Icons (react-icons/tb)
- ✅ Test your changes with the dev server
- ✅ Update both vertical and horizontal menu configurations
- ✅ Use the ApiClient for all API calls
- ✅ Use PageMetaData for page titles
- ✅ Handle errors appropriately with ErrorContext

### File References

**Key Configuration Files:**
- Frontend Routes: `Frontend/src/routes/index.tsx`
- Menu Configuration: `Frontend/src/layouts/components/data.ts`
- API Client: `Frontend/src/services/ApiClient.ts`
- Vite Config: `Frontend/vite.config.ts`
- TypeScript Config: `Frontend/tsconfig.json`
- Package Config: `Frontend/package.json`

**Key Layout Files:**
- Authenticated Layout: `Frontend/src/layouts/AuthenticatedLayout.tsx`
- Admin Layout: `Frontend/src/layouts/AdminLayout.tsx`
- Vertical Layout: `Frontend/src/layouts/VerticalLayout.tsx`

### Existing Features

The project currently has the following implemented features:
- User authentication (Firebase)
- Projects management (list, create, view, edit)
- Project documentation with wiki (rich text editing with Slate)
- Logical applications management
- Multi-step workflow forms
- Admin dashboard
- Tabbed project views (Overview, Documentation, Logical, Containers, Physical)

### Current Known Patterns

#### Project Model
Projects have the following key properties (based on existing implementation):
- Name, Description, Key (identifier)
- Owner, Contributors
- Documentation (wiki pages)
- Logical applications
- Multiple views/tabs

#### URL Patterns
- Projects: `/projects`
- Project detail: `/projects/:key`
- Project tabs: `/projects/:key/:tab`
- Wiki pages: `/projects/:key/documentation/:wikipage`
- Add project: `/projects/add`
- Add logical app: `/projects/:projectId/logical/add`
- Admin dashboard: `/admin/dashboard`

### Questions to Ask Before Starting

Before implementing a new feature, consider:
1. Does a similar component/pattern already exist in the codebase?
2. Should this be a new page or part of an existing page?
3. Does this need a new API endpoint or can it use existing ones?
4. Should this appear in the navigation menu?
5. Is this feature authenticated or public?
6. Does this need a multi-step workflow or a simple form?
7. What TypeScript types are needed?

### Getting Help

When uncertain about implementation:
1. Search the codebase for similar existing patterns
2. Check the existing component library in `Frontend/src/components/`
3. Look at existing pages in `Frontend/src/site/` for reference
4. Review the API service clients in `Frontend/src/services/`
5. Check Bootstrap 5.3.8 documentation for utility classes
6. Review Tabler Icons for available icons

---

## Quick Reference

### Common Commands
```bash
# Frontend
cd Frontend
npm install          # Install dependencies
npm run dev          # Start dev server (port 5174)
npm run build        # Build for production
npm run lint         # Run ESLint

# Backend
cd Backend/LayerCake.Api
dotnet run           # Run the API
dotnet build         # Build the project
```

### Common Imports
```typescript
// React & Router
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'

// Bootstrap Components
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap'

// Icons
import { TbIconName } from 'react-icons/tb'

// Components
import PageMetaData from '@/components/PageMetaData'
import PageBreadcrumb from '@/components/PageBreadcrumb'

// Contexts
import { useAuthContext } from '@/context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'

// Services
import { ApiClient } from '@/services/ApiClient'
```

---

**Last Updated**: 2026-01-17
**Project Version**: Active Development
**For**: Claude AI Assistant Instances
