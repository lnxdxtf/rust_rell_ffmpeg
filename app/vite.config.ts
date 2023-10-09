import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import wasmPack from 'vite-plugin-wasm-pack'
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  build: { minify: false },
  plugins: [vue(), wasmPack(['./wasm-app'])],
  envPrefix: ['VITE_'],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util']
  },
  
})
