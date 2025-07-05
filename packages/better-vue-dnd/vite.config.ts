import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), dts({ tsconfigPath: './tsconfig.app.json' })],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        }
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'better-vue-dnd',
            fileName: 'better-vue-dnd',
        },
        rollupOptions: {
            external: ['vue', 'pinia', '@vueuse/core'],
            output: {
                exports: 'named',
                globals: {
                    vue: 'Vue',
                    pinia: 'Pinia',
                    '@vueuse/core': 'VueUse',
                },
            },
        },
    },
})
