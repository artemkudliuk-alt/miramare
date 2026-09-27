import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Relative base: the same build works on GitHub Pages (/miramare/) and at a domain root
export default defineConfig({
  base: './',
  plugins: [react()],
})
