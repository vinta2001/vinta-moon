import type {AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import axios from 'axios';

const requestInstance: AxiosInstance = axios.create({
    baseURL: 'http://localhost:9090/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
})
requestInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    return config
})

requestInstance.interceptors.response.use((response: AxiosResponse) => {
    if (response.status === 200) {
        return response.data
    }
    console.log(response)
    return Promise.reject(response)
})


const requestInstance1 = axios.create({
    baseURL: 'http://localhost:9091/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
})
requestInstance1.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // console.log(config)
    return config
})

requestInstance1.interceptors.response.use((response: AxiosResponse) => {
    if (response.status === 200) {
        return response.data
    }
    console.log(response)
    return Promise.reject(response.statusText)
})


export {requestInstance, requestInstance1}