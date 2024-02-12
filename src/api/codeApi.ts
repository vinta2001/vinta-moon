import {requestInstance} from '@/utils/requestUtil'
import Constant from "@/utils/Constant";
export const getEmailCode = (email:String) => {
    return requestInstance({
        url: `/api/code/email-code?type=${Constant.email_code_type}&email=${email}`,
        method: 'get',
    })
}