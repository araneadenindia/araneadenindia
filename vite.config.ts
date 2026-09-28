import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
// @ts-ignore
import { handleApiRequest } from './api/_lib/dev-server.js';

function apiDevServerPlugin(): Plugin {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/api')) {
          handleApiRequest(req, res, next);
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), apiDevServerPlugin()],
  server: {
    port: 3000,
    open: false,
    host: true,
  },
  preview: {
    port: 3000,
    open: false,
    host: true,
  },
});
