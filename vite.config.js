import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server:{
    host:'192.168.66.16',
    port: 5173,
  },
  base: '/pet-finder/',
})