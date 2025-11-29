import { useAuth } from '@/context/useAuthContext'
import { Navigate, Outlet } from 'react-router'
import { Fragment } from 'react/jsx-runtime'

export const AuthenticatedLayout = () => {
  const { userLoggedIn, loading } = useAuth()

  return (
    <>
      {!loading && (
        <>
          {!userLoggedIn && <Navigate to="/signin" />}
          {userLoggedIn && (
            <Fragment>
              <Outlet />
            </Fragment>
          )}
        </>
      )}
      {loading &&
      <div> Loading...</div>}
    </>
  )
}
