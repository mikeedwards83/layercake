import { Navigate, type RouteObject } from 'react-router'
import MainLayout from '../layouts/MainLayout'
import { lazy } from 'react'


const Signin = lazy(() => import('@/site/signin'));

const allRoutes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/signin" replace />,
      },
      {path:"/signin", element: <Signin />}
    ],
  },
]
export const routes: RouteObject[] = [...allRoutes]
