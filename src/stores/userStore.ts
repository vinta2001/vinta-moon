import {defineStore} from 'pinia'
import {Cache} from "@/utils/Cache";

const cache = new Cache();
export const userStore = defineStore('userStore', {
    state: () => ({
        username: '',
        token: '',
        email: '',
        userId: ''
    }),
    getters: {
        getUserName(): string | null {
            return cache.getUserName();
        },
        getToken(): string | null {
            return cache.getToken();
        },
        getEmail(): string | null {
            return cache.getEmail();
        },
        getUserId(): string | null {
            return cache.getUserId();
        }
    },
    actions: {
        setUserName(username: string) {
            this.username = username
            cache.setUserName(username)
        },
        setToken(token: string) {
            this.token = token
            cache.setToken(token)
        },
        setEmail(email: string) {
            this.email = email
            cache.setEmail(email)
        },
        setUserId(userId: string) {
            this.userId = userId
            cache.setUserId(userId)
        }
    },
})