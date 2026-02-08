import { useAuth } from '@/context/useAuthContext'
import { Navigate, Outlet } from 'react-router'
import AdminLayout from './AdminLayout'
import Loader from '@/components/Loader'
import { Fragment } from 'react/jsx-runtime'
import UnauthenticatedVerticalLayout from './UnauthenticatedVerticalLayout'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useEffect, useState } from 'react'

export const AuthenticatedLayout = () => {
  const { userLoggedIn, loading } = useAuth()

  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) return <Loader height="100vh" />

  return (
    <>
      {!loading && (
        <>
          {!userLoggedIn && <Navigate to="/signin" />}
          {userLoggedIn && (
            <Fragment>
              <UnauthenticatedVerticalLayout>
                <ErrorBoundary>
                  <Outlet />
                </ErrorBoundary>
              </UnauthenticatedVerticalLayout>
            </Fragment>
          )}
        </>
      )}
      {loading && <Loader />}
    </>
  )
}
