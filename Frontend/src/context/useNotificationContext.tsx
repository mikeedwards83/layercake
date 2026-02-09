import { type ChildrenType } from '@/types'
import { createContext, use, useState } from 'react'
import { ToastBody, ToastHeader } from 'react-bootstrap'
import Toast, { type ToastProps } from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
import { ContextErrors } from '@/constants'

type ShowNotificationType = {
  title?: string
  message: string
  variant?: ToastProps['bg']
  delay?: number
}

type ToastrProps = {
  show: boolean
  onClose: () => void
} & ShowNotificationType

type NotificationContextType = {
  showNotification: ({ title, message, variant }: ShowNotificationType) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

function Toastr({ show, title, message, onClose, variant = 'light', delay }: Readonly<ToastrProps>) {
  return (
  
      <Toast bg={variant} delay={delay} show={show} onClose={onClose} autohide animation >
        {title && (
          <ToastHeader className={`text-${variant}`}>
            <strong className="me-auto">{title}</strong>
          </ToastHeader>
        )}
        <ToastBody className={['dark', 'danger', 'success', 'primary'].includes(variant) ? 'text-white' : ''}>{message}</ToastBody>
      </Toast>
  )
}

export function useNotificationContext() {
  const context = use(NotificationContext)
  if (!context) {
    throw new Error(ContextErrors.NOTIFICATION.MISSING_PROVIDER)
  }
  return context
}

export function NotificationProvider({ children }: ChildrenType) {


  const [config, setConfig] = useState<ToastrProps[]>([])

  const showNotification = ({ title, message, variant, delay = 2000 }: ShowNotificationType) => {

    const newNotification:ToastrProps =  {
      show: true,
      title,
      message,
      variant: variant ?? 'light',
      onClose: ()=>{},
      delay,
    };

    newNotification.onClose = ()=>{
      newNotification.show = false;
      const index = config.indexOf(newNotification);
     setConfig(config.splice(index,1))
    };

    setConfig([...config, newNotification])

    setTimeout(() => {
        newNotification.onClose();
    }, delay)
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      <ToastContainer className="m-3 position-fixed" position="top-end">
       {config.map(notification =><Toastr {...notification} />)}
      </ToastContainer>
      {children}
    </NotificationContext.Provider>
  )
}
