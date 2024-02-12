import {requestInstance} from '@/utils/requestUtil'
import {encryptMD5} from "@/utils/cryptoUtil";

export const userLogin = (email: string, password: string) => {
    password = encryptMD5(password);
    return requestInstance({
        url: '/user/login',
        timeout: 3000,
        method: 'post',
        data: {
            email,
            password
        }
    })
}

export const userRegister:any = (email: string, password: string, emailCode: string) => {
    password = encryptMD5(password);
    return requestInstance({
        url: '/user/register',
        timeout: 3000,
        method: 'post',
        data: {
            email,
            password,
            emailCode
        }
    })
}