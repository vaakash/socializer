import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: '.',
    emptyOutDir: false, // Prevents Vite from clearing the root folder on build
    minify: 'esbuild',
    sourcemap: false,

    rollupOptions: {
      input: {
        'socializer-js': 'js/socializer.js',
        'socializer-css':'scss/socializer.scss',
      },
      output: {
        entryFileNames: 'js/socializer.min.js',
        assetFileNames: 'css/socializer.min.[ext]',
        postBanner: '/* Socializer.js - aakashweb.com - Aakash Chakravarthy - MIT License */',
      },
    }
  },
  
  // Custom Sass settings if required
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
});