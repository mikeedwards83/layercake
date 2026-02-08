import Loader from '@/components/Loader'
import { useLayoutContext } from '@/context/useLayoutContext'
import AuthenticatedVerticalLayout from './AuthenticatedVerticalLayout'
import { Fragment, useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const MainLayout = () => {
  const { orientation } = useLayoutContext()

  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) return <Loader height="100vh" />

  return (
    <Fragment>
      {orientation === 'vertical' && (
        <AuthenticatedVerticalLayout>
          <ErrorBoundary>
          <Outlet />
          </ErrorBoundary>
        </AuthenticatedVerticalLayout>
      )}
    </Fragment>
  )
}

export default MainLayout
