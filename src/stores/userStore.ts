import {defineStore} from 'pinia'

export const userStore = defineStore('userStore', {
    state: () => ({
        username: '',
        token: '',
        email: '',
        userId: ''
    }),
    getters: {
        getUserName(): string | null {
            return this.username
        },
        getToken(): string | null {
            return this.token
        },
        getEmail(): string | null {
            return this.email
        },
        getUserId(): string | null {
            return this.userId
        }
    },
    actions: {
        setUserName(username: string) {
            this.username = username
        },
        setToken(token: string) {
            this.token = token
        },
        setEmail(email: string) {
            this.email = email
        },
        setUserId(userId: string) {
            this.userId = userId
        },
        clear() {
            this.username = ''
            this.token = ''
            this.email = ''
            this.userId = ''
        }
    },
    persist:[{
        key: 'VINTA_MOON',
        storage: localStorage,
        paths: ['username', 'token', 'email', 'userId']
    }]
})