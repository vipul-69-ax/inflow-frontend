import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from '@/components/ui/sonner'
import { SettingsProvider } from './context/biolink/biolink-settings.tsx'
import { LinksProvider } from './context/biolink/links-context.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <LinksProvider>
    <App />
    <Toaster/>
    </LinksProvider>
    </SettingsProvider>
  </StrictMode>,
)
