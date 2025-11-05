import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '../certificates/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, '../certificates/cert.pem')),
    },
    port: 5173, // opcionális
  },
})
