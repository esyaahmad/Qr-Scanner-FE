import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { NAMA_PROGRAM } from "../config/config";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: `/${NAMA_PROGRAM}`,
})
