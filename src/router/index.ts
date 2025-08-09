import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../pages/index.vue'),
        },
        {
            path: '/examples',
            name: 'examples',
            component: () => import('../pages/Examples/Examples.vue'),
        },
    ],
})

export default router
