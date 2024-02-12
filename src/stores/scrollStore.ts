import {defineStore} from "pinia";
import {ScrollCache} from "@/utils/Cache";


export const scrollStore = defineStore('scrollStore', {
    state: () => ({
        scrollTop: 0,
    }),
    getters:{
        getScrollTop(): number|null {
            return this.scrollTop
        }
    },
    actions: {
        setScrollTop(scrollTop: number) {
            this.scrollTop = scrollTop
        }
    }
})