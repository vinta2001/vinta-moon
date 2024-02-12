import Constant from "@/utils/Constant";

class Cache{

    setToken(token:string){
        window.localStorage.setItem(Constant.token,token)
    }

    getToken(){
        return window.localStorage.getItem(Constant.token)
    }

    setEmail(email:string){
        window.localStorage.setItem(Constant.email,email)
    }

    getEmail(){
            return window.localStorage.getItem(Constant.email)
    }

    setUserName(username:string){
        window.localStorage.setItem(Constant.username,username)
    }

    getUserName(){
        return window.localStorage.getItem(Constant.username)
    }
    setUserId(userId:string){
        window.localStorage.setItem(Constant.userId,userId)
    }
    getUserId(){
        return window.localStorage.getItem(Constant.userId)
    }
}


class ScrollCache{
    setScrollTop(scrollTop:number){
        window.localStorage.setItem("PAGE_SCROLL_TOP",scrollTop.toString())
    }

    getScrollTop():Number|null{
        return Number(window.localStorage.getItem("PAGE_SCROLL_TOP"))
    }
}
export {Cache,ScrollCache}