import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import handler from './server/handler';

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: path.resolve(__dirname, './dist/public'),
  },
  plugins: [
    react(),
    {
      name: 'api-handler',
      configureServer: (server) => {
        server.middlewares.use('/api/envs', handler);
      },
    },
  ],
});
