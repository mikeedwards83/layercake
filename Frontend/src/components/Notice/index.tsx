import type { ReactNode } from 'react'
import { Alert, AlertHeading } from 'react-bootstrap'
import type { Variant } from 'react-bootstrap/esm/types'
import { TbInfoCircle } from 'react-icons/tb'

interface NoticeProps {
  variant: Variant
  heading: string
  children: ReactNode
}

export const Notice = ({ variant, heading, children }: NoticeProps) => {
  return (
    <Alert variant={variant} className=" d-flex" role="alert">
      {variant == 'info' && <TbInfoCircle className="ti fs-1 me-2" />}
      <div>
        <AlertHeading as={'h4'}>{heading}</AlertHeading>
        {children}
      </div>
    </Alert>
  )
}
