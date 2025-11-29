import { useAuth } from '@/context/useAuthContext'
import { Navigate } from 'react-router'
import AdminLayout from './AdminLayout'
import Loader from '@/components/Loader'

export const AuthenticatedLayout = () => {
  const { userLoggedIn, loading } = useAuth()

  return (
    <>
      {!loading && (
        <>
          {!userLoggedIn && <Navigate to="/signin" />}
          {userLoggedIn && (
            <AdminLayout />
          )}
        </>
      )}
      {loading && <Loader />}
    </>
  )
}
