export interface NaviItem {
    name: string
    active: boolean
}

export interface PageConfig {
    isPageLoaded: boolean,
    currentPage: number,
    pageSize: number,
    dataList: any[],
    imageWidth: number,
    colHeights: number[],
    currentType: string,
    isOnTop: boolean,
    totalPage:number
}

export interface MyResponse {
    code:number,
    message:string,
    data:object
}

