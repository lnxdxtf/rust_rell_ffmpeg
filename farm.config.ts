import { defineConfig } from '@farmfe/core';
import path from 'node:path';
import vue from '@farmfe/js-plugin-vue';
import postcss from '@farmfe/js-plugin-postcss';

export default defineConfig({
  plugins: [postcss(), vue()],
  server: {
    port: 9000,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  compilation: {
    output: {
      publicPath: process.env.PUBLIC_PATH || '/',
    },
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    },
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
  },
});
