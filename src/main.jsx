import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageContext'
import { HelmetProvider } from 'react-helmet-async'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'

const rootElement = document.getElementById('root')

const app = (
  <StrictMode>
    <LanguageProvider>
      <HelmetProvider>
        <BrowserRouter>
          <App />
          <SpeedInsights />
          <Analytics />
        </BrowserRouter>
      </HelmetProvider>
    </LanguageProvider>
  </StrictMode>
)

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app)
} else {
  createRoot(rootElement).render(app)
}
