import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoName = 'haowu'
const isGitHubPages = process.env.GITHUB_PAGES === 'true'

export default defineConfig({
  base: isGitHubPages ? `/${repoName}/` : '/',
  plugins: [react()],
})
