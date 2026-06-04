import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.jsx'
import { LanguageProvider } from './contexts/LanguageContext'

createRoot(document.getElementById('root')).render(
  <LanguageProvider>
    <App />
  </LanguageProvider>
)
