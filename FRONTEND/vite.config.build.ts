import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        customElement: true,
        dev: false
      },
      emitCss: false
    })
  ],
  build: {
    minify: 'terser',
    terserOptions: {
      format: {
        comments: false
      }
    },
    lib: {
      entry: './src/main-wc.ts',
      name: 'Dynamic',
      fileName: 'dynamic',
      formats: ['umd']
    },
    rollupOptions: {
      output: {
        entryFileNames: 'dynamic.js',
        inlineDynamicImports: true,
        banner: undefined,
        footer: undefined
      }
    }
  }
});
