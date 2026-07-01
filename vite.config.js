import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base '/' because this deploys to a custom subdomain (vis.lab.allaboardohio.org).
// If you deploy to github.io/<repo-name> instead, set base to '/<repo-name>/'.
export default defineConfig({
  base: '/',
  plugins: [react()],
})
