import {createRouter, createWebHistory} from 'vue-router'

import Home from '@/views/home/Home.vue'
import Login from '@/views/login/Login.vue'
import NotFound from '@/views/notFound/NotFound.vue'
import User from '@/views/user/User.vue'
import Info from "@/views/user/Info.vue";
import {scrollStore} from "@/stores/scrollStore";
import {userStore} from "@/stores/userStore";
import {ElMessage} from "element-plus";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [{
        path: '/',
        redirect: '/explore',
        meta: {keepAlive: true}
    }, {
        path: '/explore',
        component: Home,
        meta: {keepAlive: false}
    }, {
        path: '/user',
        redirect: '/user/login',
        children: [{
            path: '/user/login',
            component: Login
        }, {
            path: '/user/info',
            component: Info,
            meta: {keepAlive: true}
        }]
    }, {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    }, {
        path: '/user',
        component: User
    }, {
        path: "/publish",
        component: () => import("@/views/publish/Publish.vue")
    }],
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            console.log(to, from, savedPosition)
            return {
                el: to.hash,
            }
        }
    }
})


export default router
