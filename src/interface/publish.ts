export interface NoteBody {
    "userId": string,
    "postId": string,
    "description": string,
    "content": string,
    "mediaList": Media[],
    "tagList": string[],
    "musicLink": string,
    "createTime": number,
    "type": string,
    "location": string,
    "access": string,
    "postTime": number,
    "status": number
}

export interface Media {
    "mediaMd5": string,
    "mediaUrl": string
}

export interface Location {
    category?: number,
    cityName?: string,
    cityNameSpell: string,
    distance: number,
    latitude: number,
    link: string,
    longitude: number,
    name: string,
    originSource: number,
    poiLongId: number,
    poiOid: string,
    poiPageId: string,
    rateScore: number,
    recommendType: number,
    sortScore: number,
    source: number,
    subname: string
}