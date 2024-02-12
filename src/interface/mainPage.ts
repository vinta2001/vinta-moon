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
    isOnTop: boolean
}

export interface MyResponse {
    code:number,
    message:string,
    data:object
}

