import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/AptosWalletConnectKit/',
  root: 'demo',
  build: {
    outDir: '../dist-demo',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
