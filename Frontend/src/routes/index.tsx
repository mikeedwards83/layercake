import { Navigate, type RouteObject } from 'react-router'
import { lazy } from 'react'
import { AuthenticatedLayout } from '@/layouts/AuthenticatedLayout';

const Signin = lazy(() => import('@/site/signin'));
const AdminDashboard = lazy(() => import('@/site/admin/dashboard'));
const Projects = lazy(() => import('@/site/projects'));
const ProjectsAdd = lazy(() => import('@/site/projects/add'));
const Project = lazy(() => import('@/site/projects/[key]'));
const LogicalApplicationAdd = lazy(() => import('@/site/projects/logical/add'));
const LogicalApplication = lazy(() => import('@/site/projects/[key]/logical/[logicalKey]'));
const ContainerAdd = lazy(() => import('@/site/projects/[key]/logical/[logicalKey]/containers/add'));


const anonRoutes: RouteObject[] =[
  {
    children:[
      {path:"/signin", element: <Signin />}

    ]
  }
]

const authRoutes: RouteObject[] = [
  {
    element: <AuthenticatedLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {path:"/admin/dashboard", element: <AdminDashboard />},
      {path:"/projects", element: <Projects />},
      {path:"/projects/add", element: <ProjectsAdd />},
      {path:"/projects/:projectId/logical/add", element: <LogicalApplicationAdd />},
      {path:"/projects/:key/logical/:logicalKey/containers/add", element: <ContainerAdd />},
      {path:"/projects/:key/logical/:logicalKey", element: <LogicalApplication />},
      {path:"/projects/:key/logical/:logicalKey/:tab", element: <LogicalApplication />},
      {path:"/projects/:key", element: <Project />},
      {path:"/projects/:key/:tab", element: <Project />},
      {path:"/projects/:key/documentation/:wikipage", element: <Project />}
    ],
  },
]
export const routes: RouteObject[] = [...authRoutes,...anonRoutes]
