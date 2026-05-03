import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves the site from /<repo-name>/
// Set VITE_BASE in CI or override locally if you fork.
const base = process.env.VITE_BASE ?? '/franchise-territory-map/'

export default defineConfig({
  plugins: [react()],
  base,
})
