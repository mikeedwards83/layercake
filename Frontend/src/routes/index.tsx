import { Navigate, type RouteObject } from 'react-router'
import { lazy } from 'react'
import { AuthenticatedLayout } from '@/layouts/AuthenticatedLayout';

const Signin = lazy(() => import('@/site/signin'));
const Projects = lazy(() => import('@/site/projects'));
const ProjectsAdd = lazy(() => import('@/site/projects/add'));


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
        element: <Navigate to="/signin" replace />,
      },
      {path:"/projects", element: <Projects />},
      {path:"/projects/add", element: <ProjectsAdd />}
    ],
  },
]
export const routes: RouteObject[] = [...authRoutes,...anonRoutes]
