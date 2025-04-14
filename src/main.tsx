import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from '@/components/ui/sonner'
import '@/lib/i18next.ts'
import LanguageSwitcher from './components/Translation.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    
    <App />
    <LanguageSwitcher/>
    <Toaster/>
  </StrictMode>,
)
