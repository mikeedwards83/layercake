import Loader from '@/components/Loader'
import { useLayoutContext } from '@/context/useLayoutContext'
import VerticalLayout from './VerticalLayout'
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
        <VerticalLayout>
          <ErrorBoundary>
          <Outlet />
          </ErrorBoundary>
        </VerticalLayout>
      )}
    </Fragment>
  )
}

export default MainLayout
