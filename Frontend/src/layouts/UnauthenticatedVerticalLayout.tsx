import Footer from '@/layouts/components/footer'
import Topbar from '@/layouts/components/topbar'
import { Fragment } from 'react'

import type { ChildrenType } from '@/types'

const AuthenticatedVerticalLayout = ({ children }: ChildrenType) => {
  
  return (
    <Fragment>
      <div className="wrapper">
        <Topbar />
        <div className="content-page">
          {children}
          <Footer />
        </div>
      </div>
    </Fragment>
  )
}

export default AuthenticatedVerticalLayout
