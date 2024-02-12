
export default function formatDate(date:Date):string{
    if(date){
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    }
    return "";
}