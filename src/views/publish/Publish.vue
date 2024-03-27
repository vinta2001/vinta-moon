<script setup lang="ts">
import {v4 as uuid} from 'uuid';
import {reactive, ref} from "vue";
import SparkMD5 from 'spark-md5';
import {mediaUpload, postUpload} from '@/api/pictureApi';
import type {Media, NoteBody} from "@/interface/publish";
import {ElMessage} from "element-plus";
import {userStore} from "@/stores/userStore";
import axios from 'axios'
import zhCn from "element-plus/es/locale/lang/zh-cn";
//global variable
const titlePlaceholder = ref<string>("填写标题，可能会收到更多赞哦~");
const contentPlaceholder = ref<string>("填写更全面的描述信息，让更多的人看到你吧!");
const local = zhCn;
const mediaShowList = ref<string[]>([]);
const postMediaUrlList = ref<Media[]>([]);
const chunkSize = 10 * 1024 * 1024;
const fileBtn = ref("fileBtn")
const user = userStore();
const postBody = reactive<NoteBody>({
  "status": 1,
  "userId": "",
  "postId": "",
  "description": "",
  "content": "",
  "mediaList": [],
  "tagList": [],
  "musicLink": "",
  "createTime": 0,
  "type": "",
  "location": "",
  "access": "public",
  "postTime": 0
})


async function fileInput(e: Event) {
  const target = e.target as HTMLInputElement;
  const file: File | null = target.files && target.files[0];
  if (!file) {
    return;
  }

  (<HTMLInputElement>e.target)!.value = "" as string;
  if (file.size > chunkSize) {
    ElMessage.error("图片大小不能超过10M");
    return;
  }
  const chunks = createChunks(file, chunkSize);
  const fileMD5 = <string>await getFileMd5(chunks);
  const result: string = <string>await drawPic(file);
  const fileList: FormData[] = []
  chunks.forEach((value: Blob, index: number, array: Blob[]) => {
    let formData = new FormData();
    formData.append("file", value);
    formData.append("md5", fileMD5);
    formData.append("currentChunk", index.toString());
    formData.append("totalChunks", array.length.toString());
    formData.append("currentChunkSize", value.size.toString());
    formData.append("totalSize", file.size.toString());
    formData.append("type", "image");
    formData.append("name", file.name);
    fileList.push(formData);
  })
  await sendPicture(fileList);
  if (postMediaUrlList.value.length > 0) {
    mediaShowList.value.push(result);
  }
}

function createChunks(file: File, chunkSize: number) {
  const chunks = [];
  for (let i = 0; i < file.size; i += chunkSize) {
    let blob = file.slice(i, i + chunkSize);
    chunks.push(blob);
  }
  return chunks;
}

function getFileMd5(chunks: Blob[]) {
  return new Promise((resolve) => {
    const spark = new SparkMD5.ArrayBuffer();

    function _read(index: number) {
      if (index >= chunks.length) {
        resolve(spark.end());
        return;
      }
      const blob = chunks[index];
      const reader = new FileReader();
      reader.onload = (e: Event) => {
        spark.append((<FileReader>e.target).result as ArrayBuffer);
        _read(index + 1);
      }
      reader.readAsArrayBuffer(blob);
    }

    _read(0);
  })
}

async function drawPic(file: File) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e: Event) => {
      const result = (<FileReader>e.target)?.result;
      resolve(result);
    }
  })
}

async function sendPicture(fileList: FormData[]) {
  let result = await mediaUpload(fileList[0]);
  if (result.data && result.data.skip === true) {
    postMediaUrlList.value.push({mediaMd5: result.data.mediaMd5, mediaUrl: result.data.mediaUrl});
    return;
  }
}

function sendPictureNote() {
  postBody.userId = <string>user.getUserId;
  postBody.postId = uuid().replace(/-/g, "");
  postBody.mediaList = postMediaUrlList.value;
  postBody.createTime = new Date().getTime();
  postBody.type = "image";
  postBody.status = Number(postBody.status);
  if (postBody.status === 1) {
    postBody.postTime = postBody.createTime;
  }
  postUpload(postBody).then((res: any) => {
    if (res.code !== 200) {
      if (res.code === 203) {
        ElMessage.error(res.msg);
      } else {
        ElMessage.info(res.msg);
      }
    } else {
      ElMessage.success("发布成功");
      setTimeout(() => {
        window.location.reload();
      }, 1000)
    }
  }).catch((rej) => {
    console.log(rej)
  });
}

function pushMorePicture() {
  let element = document.getElementById("file-input_more");
  element?.click();
}

const getLocationRecommend = (query: string, cb: any) => {
  if (query.length) {
    let data = {"locations": [{"longitude": 0, "latitude": 0}], "keyword": query, "page_num": 0};
    let config = {
      method: 'post',
      url: '/web_api/sns/v5/creator/poi/search',
      data: data
    }
    let axiosInstance = axios.create({
      timeout: 5000
    });
    axiosInstance(config).then(res => {
      cb(res.data.data)
    }).catch(rej => {
      console.log(rej)
    })
  }
}

function getLocation(item: Record<string, any>): any {
  postBody.location = item?.name;
}


</script>

<template>
  <div class="publish">
    <div class="upload-container" v-show="mediaShowList.length === 0">
      <p>上传图片</p>
      <div class="upload-main-container">
        <label id="file-load">
          <input type="file" id="file-input" ref="fileBtn" @change="fileInput($event)">
        </label>
        <p>拖拽图片上传或点击上传</p>
      </div>
    </div>
    <div class="editor-main-container" v-show="mediaShowList.length !== 0">
      <div class="editor">
        <div id="editor-type">
          <div id="icon"></div>
          发布图文
        </div>
        <div class="image-show">
          <div class="image-show-title">
            <span>图片编辑</span>
            <div class="upload-more" @click="pushMorePicture()">+上传更多</div>
            <input type="file" id="file-input_more" @change="fileInput($event)">
          </div>
          <div class="image-show-container">
            <div class="image-show-container-body" v-for="item in mediaShowList">
              <img :src="item" class="preview" :alt="item"/>
            </div>
          </div>
        </div>
        <div class="editor-title">
          <div class="title-container">
            <input type="text"
                   :placeholder="titlePlaceholder"
                   @blur="postBody.description=postBody.description.slice(0,30)"
                   class="title-input"
                   v-model="postBody.description"
                   ref="title">
            <div class="title-suffix">
              <span>{{ postBody.description.length }}</span>/30
            </div>
          </div>
        </div>
        <div class="editor-content">
          <div class="content-container">
            <p id="content-container"
               contentEditable="true"
               :placeholder="contentPlaceholder"
               @blur="postBody.content=postBody.content.slice(0,1000)"
               @input="$e=>{postBody.content = (<HTMLElement>$e.target)?.innerText.replace(/\n/g, '<br/>')}"></p>
            <div class="content-suffix">
              <span>{{ postBody.content.length }}</span>/1000
            </div>
          </div>
        </div>
        <div class="editor-tags"></div>
        <div class="image-editor"></div>
        <div class="editor-setting">
          <p>发布设置</p>
          <div class="setting-content">
            <div class="editor-setting-box">
              <p class="setting-name">添加地点</p>
              <el-autocomplete
                  v-model="postBody.location"
                  :fetch-suggestions="getLocationRecommend"
                  placeholder="搜索你感兴趣的地址吧~"
                  clearable
                  @select="getLocation"
              >
                <template #loading>
                  <svg class="circular"
                       viewBox="0 0 50 50">
                    <circle class="path"
                            cx="25"
                            cy="25"
                            r="20"
                            fill="none"/>
                  </svg>
                </template>
                <template #default="{ item }">
                  <div class="location-name">{{ item.name }}</div>
                  <span class="location-subname">{{ item.subname }}</span>
                </template>
              </el-autocomplete>
            </div>
            <div class="editor-setting-box">
              <p class="setting-name">权限设置</p>
              <div class="access-input">
                <label><input type="radio"
                              value="public"
                              v-model="postBody.access">
                  <span>公开（所有人可见）</span>
                </label>
              </div>
              <div class="access-input">
                <label>
                  <input type="radio"
                         value="private"
                         v-model="postBody.access">
                  <span>私密（仅自己可见）</span>
                </label>
              </div>
            </div>
            <div class="editor-setting-box">
              <p class="setting-name">发布时间</p>
              <div class="publish-time-input">
                <label>
                  <input type="radio"
                         value="1"
                         v-model="postBody.status">
                  <span>立即发布</span>
                </label>
              </div>
              <div class="publish-time-input">
                <label>
                  <input type="radio"
                         value="0"
                         v-model="postBody.status">
                  <span>定时发布</span>
                </label>
                <div class="date-timer"
                     v-show="postBody.status == 0">
                  <el-config-provider :locale="local">
                    <el-date-picker
                        v-model="postBody.postTime"
                        type="datetime"
                        placeholder="请选择日期时间"
                        format="YYYY/MM/DD HH:mm:ss"
                        value-format="x"
                    />
                  </el-config-provider>
                </div>
              </div>
            </div>
            <div class="editor-setting-box">
              <button class="publishBtn"
                      id="publish-button"
                      @click="sendPictureNote()">发布
              </button>
              <button class="publishBtn"
                      id="cancel-button">取消
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="phone">
        <div class="show-container">
          <div id="notify">
            <div class="notify-time">18:47</div>
            <div id="sign"></div>
            <div id="web"></div>
            <div id="battery"></div>
          </div>
          <div id="top">
            <div id="return"></div>
            <div class="header"></div>
            <div id="follow">关注</div>
            <div id="share"></div>
          </div>
          <div id="middle">
            <div class="image-container">
              <div class="image-container-body" v-for="item in mediaShowList">
                <img :src="item" class="phone-preview"/>
              </div>
            </div>
            <div id="title">{{ postBody.description.length === 0 ? "请先填写标题" : postBody.description }}</div>
            <div id="content" v-html="postBody.content"></div>
            <div id="time">2021-02-02 21:11:36</div>
            <div id="header-container">
              <div class="header"></div>
              <p class="comment">爱评论的人运气都不错~</p>
            </div>
            <div id="comment-show">
              <div id="empty"></div>
              <div id="null">这里一片荒地，<span>点击评论</span></div>
              <div id="nothing"></div>
            </div>
          </div>
          <div id="bottom">
            <div id="comment-input">
              <div class="bottom-icon" id="input-icon"></div>
              说点什么...
            </div>
            <div class="bottom">
              <div class="bottom-icon" id="like-icon"></div>
              点赞
            </div>
            <div class="bottom">
              <div class="bottom-icon" id="collect-icon"></div>
              收藏
            </div>
            <div class="bottom">
              <div class="bottom-icon" id="comment-icon"></div>
              评论
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.date-timer {
  margin-left: 10px;
}

.location-subname {
  font-size: 12px;
}

#file-input_more {
  display: none;
}

#nothing {
  height: 10vh;
}

.circular {
  display: inline;
  height: 30px;
  width: 30px;
  animation: loading-rotate 2s linear infinite;
}

.path {
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: var(--el-color-primary);
  stroke-linecap: round;
}

.publish-time-input {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.publish {
  position: fixed;
  left: 15vw;
  background-color: #ddeff8;
  height: 100vh;
  width: 85vw;
  display: flex;
  justify-content: center;
  align-items: center;
}

.upload-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80vw;
  height: 80vh;
  flex-direction: column;
  background-color: white;
  border-radius: 10px;
}

.upload-main-container {
  width: 90%;
  height: 90%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  background-color: #ecf1f1;

}

.editor-main-container {
  display: flex;
  position: relative;
  left: 1vw;
  height: 90vh;
  width: 100%;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: white;
  overflow-x: hidden;
}

#file-load {
  width: 12vw;
  height: 12vw;
  border-radius: 10px;
  background-image: url("@/assets/icons/file-load.png");
  background-size: cover;
  cursor: pointer;
  border: white 1px solid;
}

#file-load:hover {
  background-image: url("@/assets/icons/file-load-hover.png");
}

#file-input {
  opacity: 0;
  cursor: pointer;
}

#editor-type {
  display: flex;
  font-size: 20px;
  width: 100%;
  align-items: center;
  margin-bottom: 20px;
}

#icon {
  background-color: #00b6b6;
  width: 10px;
  height: 25px;
  border-radius: 5px;
}

.image-show,
.editor-content,
.editor-title {
  width: 100%;
}


.image-show-container {
  display: flex;
  flex-direction: row;
}

.image-show-container-body {
  width: 12vw;
  height: 10vw;
  border-radius: 10px;
  background-color: #f6fbff;
  border: white 1px solid;
  display: flex;
  justify-content: center;
}

.image-show-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 20px;
}

.upload-more {
  color: #00b6b6;
  margin: 10px;
  cursor: pointer;
  font-size: 16px;
}


.title-container {
  width: 55vw;
  display: flex;
  align-items: center;

}

.title-input {
  width: 50vw;
  height: 5vh;
  padding-left: 1vw;
  border-radius: 10px;
  margin: 10px 0;
  border: 1px solid #b2b2b2;
}

.title-input:focus,
#content-container:focus {
  outline: none;
}

.title-suffix {
  position: absolute;
  padding-left: 48vw;
  color: #737373;
  pointer-events: none;
}


.content-container {
  width: 55vw;
  display: flex;
  align-items: center;
}

#content-container::-webkit-scrollbar {
  display: none;
}

#content-container {
  width: 51vw;
  height: 20vh;
  border-radius: 10px;
  padding: 10px;
  background-color: white;
  margin: 10px 2px;
  box-sizing: border-box;
  text-align: start;
  border: 1px solid #b2b2b2;
  overflow-y: scroll;
}

.content-suffix {
  position: absolute;
  top: 113vh;
  right: 9vw;
  color: #737373;
  pointer-events: none;
}

#content-container:empty::before {
  content: attr(placeholder);
  color: #737373;
  font-size: 14px;
}


.editor {
  position: relative;
  top: 60px;
  width: 60vw;
  height: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}


.phone {
  width: 280px;
  height: 82vh;
  background-color: white;
  border-radius: 50px;
  border: 1px solid #00e1ff;
  box-shadow: #cccccc 0 0 10px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.show-container {
  width: 260px;
  height: 78vh;
  background-color: white;
  border-radius: 35px;
  border: 1px solid #c7c7c7;
  justify-content: center;
  padding: 10px;
  overflow-y: scroll;
  overflow-x: hidden;
}

.show-container::-webkit-scrollbar {
  display: none;
}

#notify {
  width: 270px;
  height: 33px;
  display: flex;
  position: absolute;
  top: 4.5vh;
  left: 63vw;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-top: 1px solid #c7c7c7;
  border-radius: 26px 26px 0 0;
}

.notify-time {
  font-size: 12px;
  font-weight: bolder;
  padding: 0 10px;
}

#sign {
  background-image: url("@/assets/icons/sign.png");
  background-size: cover;
  height: 12px;
  margin-left: 125px;
  width: 12px;
}

#web {
  background-image: url("@/assets/icons/web.png");
  background-size: cover;
  padding: 1px 3px;
  height: 10px;
  margin-left: 5px;
  width: 10px;
}

#battery {
  background-image: url("@/assets/icons/battery.png");
  background-size: cover;
  height: 10px;
  padding: 5px;
  margin-left: 5px;
  width: 10px;
}

#top {
  position: relative;
  display: flex;
  font-size: 20px;
  align-items: center;
  margin-top: 16px;
}

#return {
  background-image: url("@/assets/icons/return.png");
  background-size: cover;
  height: 5px;
  padding: 5px;
  width: 5px;
}


.header {
  background-color: #00b6b6;
  width: 1.5vw;
  height: 1.5vw;
  border-radius: 50%;
}

#follow {
  height: 16px;
  width: 40px;
  font-size: 12px;
  font-weight: bolder;
  color: #ff0000;
  font-family: "黑体";
  border: 1px solid #ff0000;
  border-radius: 10px;
  text-align: center;
  margin-left: 130px;
}

#share {
  background-image: url("@/assets/icons/share.png");
  background-size: cover;
  height: 5px;
  padding: 5px;
  margin-left: 10px;
  width: 5px;
}

#middle {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}

.image-container {
  height: 15vw;
  width: 16vw;
  display: flex;
  flex-direction: row;
  overflow-y: hidden;

}

.image-container-body {
  height: 14vw;
  width: auto;
  border-radius: 10px;
  background-color: #f6fbff;
  border: white 1px solid;
  display: flex;
  justify-content: center;
}

.image-container::-webkit-scrollbar {
  display: none
}

#title {
  position: relative;
  width: 100%;
  height: auto;
  margin: 0 0 0 10px;
  font-size: 14px;

}

#content {
  position: relative;
  width: 100%;
  height: auto;
  margin: 5px 0 0 10px;
  font-size: 12px;
}

#header-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
}

.comment {
  width: 80%;
  height: 20px;
  display: flex;
  background-color: #f5f5f5;
  margin-left: 10px;
  padding-left: 10px;
  text-align: center;
  align-items: center;
  font-size: 10px;
  font-weight: bolder;
  color: #c9c9c9;
  font-family: "黑体";
  border-radius: 10px;
}

#time {
  width: 100%;
  margin-top: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #ececec;
  font-size: 6px;
  font-weight: bold;
  color: #c9c9c9;
  font-family: "黑体";
  display: flex;
  margin-left: 10px;
  justify-content: start;
}

#comment-show {
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;

}

#empty {
  background-image: url("@/assets/icons/empty.png");
  background-size: cover;
  height: 60px;
  width: 60px;
}

#null {
  margin-top: 10px;
  font-size: 10px;
  font-family: "黑体";
}

#null span {
  color: #009191;
  font-family: "黑体";
}

#bottom {
  position: absolute;
  bottom: 45px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  z-index: 1;
}

#comment-input {
  display: flex;
  align-items: center;
  width: 100px;
  height: 20px;
  font-size: 10px;
  font-weight: bolder;
  color: #9f9f9f;
  font-family: "黑体";
  border: none;
  border-radius: 10px;
  background-color: #e1e1e1;
}

#input-icon {
  background-image: url("@/assets/icons/input.png");
  background-size: cover;
  height: 5px;
  padding: 5px;
  width: 5px;
}

.bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  font-size: 10px;
  font-weight: bolder;
}

.bottom-icon {
  margin: 0 5px;
}

#like-icon {
  background-image: url("@/assets/icons/dislike.png");
  background-size: cover;
  height: 5px;
  padding: 5px;
  width: 5px;
}

#collect-icon {
  background-image: url("@/assets/icons/collect.png");
  background-size: cover;
  height: 5px;
  padding: 5px;
  width: 5px;
}

#comment-icon {
  background-image: url("@/assets/icons/comment.png");
  background-size: cover;
  height: 5px;
  padding: 5px;
  width: 5px;
}

.editor-setting {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: 20px;
}

.editor-setting-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}

#text {
  width: 250px;
  height: 30px;

}

.dropdown {
  position: absolute;
  left: 5.4vw;
  top: 84vh;
  background-color: white;
  width: 258px;
  height: 300px;
  overflow-y: scroll;
}

.dropdown::-webkit-scrollbar {
  display: none;
}

.location-item {
  height: 50px;
  border: 1px solid #d0d0d0;
}

.setting-name {
  margin-right: 15px;
  font-size: 14px;
}

.publishBtn {
  width: 120px;
  height: 40px;
  margin: 20px;
  border-radius: 10px;
  border: none;
  font-size: 16px;
  cursor: pointer;
}

#publish-button {
  background-color: red;
  color: white;
}

#cancel-button {
  background-color: #dcdcdc;
}

.preview {
  padding: 5px;
  width: auto;
  max-width: 12vw;
  max-height: 10vw;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.phone-preview {
  padding: 5px;
  height: auto;
  width: auto;
  max-height: 16vw;
  max-width: 20vw;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>