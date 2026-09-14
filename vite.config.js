import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Served from the root of theerthalayagroup.com. If this ever moves back to a
  // project sub-path (user.github.io/<repo>/), this must change with it —
  // BASE_URL feeds every locally-served asset path in the app.
  base: '/',
})
