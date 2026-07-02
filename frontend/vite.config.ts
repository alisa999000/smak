import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

const siteRoot = path.resolve(__dirname, '../www/smachnaya.ru')

export default defineConfig({
  plugins: [
    vue({
      template: {
        transformAssetUrls: {
          includeAbsolute: false,
        },
      },
    }),
    {
      name: 'serve-site-assets',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url?.split('?')[0] ?? ''
          if (!url.startsWith('/assets/') && !url.startsWith('/image/')) {
            return next()
          }
          const filePath = path.join(siteRoot, url)
          if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
            return next()
          }
          res.setHeader('Content-Type', getMime(url))
          fs.createReadStream(filePath).pipe(res)
        })
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': 'http://localhost:3105',
      '/commerce': 'http://localhost:3105',
      '/evocms-user': 'http://localhost:3105',
      '/auth': 'http://localhost:3105',
      '/uploads': 'http://localhost:3105',
    },
  },
  build: {
    outDir: '../www/smachnaya.ru/vue-dist',
    emptyOutDir: true,
  },
})

function getMime(url: string): string {
  if (url.endsWith('.css')) return 'text/css'
  if (url.endsWith('.js')) return 'application/javascript'
  if (url.endsWith('.svg')) return 'image/svg+xml'
  if (url.endsWith('.png')) return 'image/png'
  if (url.endsWith('.jpg') || url.endsWith('.jpeg')) return 'image/jpeg'
  if (url.endsWith('.json')) return 'application/json'
  return 'application/octet-stream'
}
