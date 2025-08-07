import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import path from 'node:path'
import pkg from './package.json'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), dts({ tsconfigPath: './tsconfig.app.json', cleanVueFileName: true })],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
        dedupe: ['vue', '@vue/runtime-core'],
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'better-vue-dnd',
            fileName: 'better-vue-dnd',
        },
        rollupOptions: {
            external: [
                ...Object.keys(pkg.peerDependencies ?? {}),
            ],
            output: { 
                exports: 'named',
                globals: {
                    vue: 'Vue',
                    pinia: 'Pinia',
                    mitt: 'Mitt',
                    '@vueuse/core': 'VueUse',
                    '@vitejs/plugin-vue': 'ViteJs',
                }
            },
        },
    },
})
