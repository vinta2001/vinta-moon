import {requestInstance} from '@/utils/requestUtil'
import type {NoteBody} from "@/interface/publish";

function mediaUpload(body: FormData) {
    return requestInstance({
        url: '/post/media/upload',
        method: 'post',
        data: body,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

function postUpload(postBody: NoteBody) {
    return requestInstance({
        url: '/post/note/upload',
        method: 'post',
        data: postBody
    })
}

function getMediaList(data: any) {
    return requestInstance({
        url: "/post/note/feed",
        method: 'post',
        data:data
    })
}

export {mediaUpload, postUpload,getMediaList}