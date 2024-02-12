import CryptoJS from "crypto-js";

export const encryptMD5 = (text: string) => {
    return CryptoJS.MD5(text).toString();
};