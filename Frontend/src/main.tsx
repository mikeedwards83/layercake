import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import AppWrapper from './components/AppWrapper.tsx'

import '@/assets/scss/app.scss'
import { AuthProvider } from './context/useAuthContext.tsx'
import { ErrorProvider } from './context/useErrorContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppWrapper>
        <ErrorProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ErrorProvider>
      </AppWrapper>
    </BrowserRouter>
  </StrictMode>,
)
