import {createRouter, createWebHistory} from 'vue-router'

import Home from '@/views/home/Home.vue'
import Login from '@/views/login/Login.vue'
import NotFound from '@/views/notFound/NotFound.vue'
import Info from "@/views/user/Info.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [{
        path: '/',
        redirect: '/explore',
        meta: {keepAlive: true}
    }, {
        path: '/explore',
        component: Home,
    }, {
        path: '/user',
        redirect: '/user/login',
        children: [{
            path: 'login',
            component: Login
        }, {
            path: 'info',
            component: Info,
        }]
    }, {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    }, {
        path: "/publish",
        component: () => import("@/views/publish/Publish.vue")
    }],
})


export default router
