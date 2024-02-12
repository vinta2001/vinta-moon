export interface RegiserReq{
    password:string,
    password1:string,
    emailCode:string,
    email:string
}

export interface LoginReq{
    email:string,
    password:string,
}