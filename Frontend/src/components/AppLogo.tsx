import { Image } from 'react-bootstrap'
import { Link } from 'react-router'

import logoDark from '@/assets/images/logo-rectangle.png'

const AppLogo = () => {
  return (
    <>
      <Link to="/">
        <Image src={logoDark} alt="dark logo" height="32" />
      </Link>
    </>
  )
}

export default AppLogo
