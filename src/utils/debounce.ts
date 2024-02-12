export default function debounce(func:any,wait:number){
    let timeout:any;
    return function(page:number){
        clearTimeout(timeout)
        timeout = setTimeout(()=>{
            func.call(null,page);
        },wait)
    }
}