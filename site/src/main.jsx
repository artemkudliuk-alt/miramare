import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// ponytail: no StrictMode — the scene controller drives <video> imperatively and must mount once
createRoot(document.getElementById('root')).render(<App />)
