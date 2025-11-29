import { Navigate, type RouteObject } from 'react-router'
import MainLayout from '../layouts/MainLayout'
import { lazy } from 'react'


const Signin = lazy(() => import('@/site/signin'));
const Projects = lazy(() => import('@/site/projects'));


const anonRoutes: RouteObject[] =[
  {
    children:[
      {path:"/signin", element: <Signin />}

    ]
  }
]

const authRoutes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/signin" replace />,
      },
      {path:"/projects", element: <Projects />}
    ],
  },
]
export const routes: RouteObject[] = [...authRoutes,...anonRoutes]
