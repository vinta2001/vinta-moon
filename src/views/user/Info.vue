<script setup lang="ts">
import {userStore} from "@/stores/userStore";
import {useRouter} from "vue-router";
import {onMounted, reactive} from "vue";
import {ArrowUp} from "@element-plus/icons-vue";
import {getMediaList} from "@/api/pictureApi";
import {ElMessage} from "element-plus";
import type {PageConfig} from "@/interface/mainPage";

const router = useRouter()
const user_store = userStore()

interface UserInfo {
  id: string
  nickname: string
  avatar: string
  desc: string
  followers: number
  fans: number
  attention: number,
  gender: string,
  age: number,
  ip: string
}

let pageConfig = reactive<PageConfig>({
  isPageLoaded: false,
  currentPage: 1,
  pageSize: 10,
  dataList: [],
  imageWidth: 220,
  colHeights: [0, 0, 0, 0],
  currentType: '推荐',
  isOnTop: true,
  totalPage: 2,
})
const user_info = reactive<UserInfo>({
  id: "12345454",
  nickname: "小夜拍照不积极",
  avatar: "http://localhost:9090/api/user/avatar/download/98edb891586d479a889f4dc08f792802.jpg",
  desc: "| 人像 | 风光 | 人文 |\n什么都拍 | 什么都想拍\n接互勉约拍 | 直接私戳哦".replace(/\n/g, "<br/>"),
  followers: 241,
  fans: 9,
  attention: 25,
  gender: "male",
  age: 18,
  ip: "陕西"
})

function isLogin() {
  if (!user_store.getUserId) {
    router.push("/user/login")
  }
}

function waterFull() {
  let container: HTMLElement = document.querySelector('.data-list') as HTMLElement;
  // 可视区域高度
  const sections: HTMLElement[] = Array.from(document.querySelectorAll('.note-section'));
  const itemWidth: number = sections[0].offsetWidth;
  let colNum: number = 5;
  (container as HTMLElement).style.width = itemWidth * colNum + 'px';
  let itemHeights: number[] = [];
  for (let i = 0; i < sections.length; i++) {
    if (i < colNum) {
      itemHeights.push(sections[i].offsetHeight);
    } else {
      let minHeight = Math.min(...itemHeights);
      let minIndex = itemHeights.indexOf(minHeight);
      sections[i].style.position = 'absolute';
      sections[i].style.left = minIndex * itemWidth + 'px';
      sections[i].style.top = minHeight + 'px';
      itemHeights[minIndex] += sections[i].offsetHeight;
    }
  }
}

function getData() {
  const query = {
    "pageSize": pageConfig.pageSize,
    "pageNum": pageConfig.currentPage++,
    "total": pageConfig.totalPage,
    "category": "",
    "searchKey": "",
    "cursorScore": "",
    "userId": ""
  }
  if(pageConfig.currentPage > pageConfig.totalPage) {
    return;
  }
  getMediaList(query).then((res) => {
    pageConfig.totalPage = res.data.total;
    const items: any[] = res.data.data;
    items.forEach((item: any) => {
      pageConfig.dataList.push(item)
    })
  }).catch((error) => {
        if (error.code === "ERR_NETWORK") {
          ElMessage.error("网络错误")
        }
      }
  ).finally(() => {
    waterFull()
    pageConfig.isPageLoaded = false
  })
}

function load() {
  getData()
  waterFull()
}

function onScroll() {
  pageConfig.isOnTop = (window.pageYOffset || window.scrollY) === 0;
}

function toTop() {
  let top = window.scrollY;
  let speed = top / 20;
  let duration = 10;
  const timer = setInterval(() => {
    top -= speed
    window.scrollTo(0, top)
    if (top <= 0) {
      clearInterval(timer)
    }
  }, duration)
}

onMounted(() => {
  isLogin()
  window.addEventListener("scroll", onScroll)
})

</script>

<template>
  <div id="info-container">
    <Search class="search"></Search>
    <div id="user-info">
      <div class="user-base-info">
        <div class="user-info-head">
          <img :src="user_info.avatar" alt="user_info.avatar">
        </div>
        <div class="user-info-body">
          <span id="nickname-span">{{ user_info.nickname }}</span>
          <span id="user-id-ip">
            <span>小蓝书号： {{ user_info.id }}</span>
            <span>&nbsp;&nbsp;&nbsp;</span>
            <span>IP属地： {{ user_info.ip }}</span>
          </span>
          <span class="user-info-desc" v-html="user_info.desc"></span>
          <div class="gender-birthday">
            <div id="gender" :class="user_info.gender"></div>
            <br/>
            <span style="font-size: 12px">{{ user_info.age }}岁</span>
          </div>
          <div class="user-info-footer">
            <span class="footer-font">{{ user_info.followers }}</span>关注
            <span>&nbsp;&nbsp;</span>
            <span class="footer-font">{{ user_info.fans }}</span>粉丝
            <span>&nbsp;&nbsp;</span>
            <span class="footer-font">{{ user_info.attention }}</span>获赞与收藏
          </div>
        </div>
      </div>
      <div class="data-list" v-infinite-scroll="load" infinite-scroll-distance="20" @scroll="onScroll">
        <div class="back-top" v-show="!pageConfig.isOnTop" @click="toTop">
          <ArrowUp class="top-icon"></ArrowUp>
        </div>
        <div class="note-section" v-for="(item,index) in pageConfig.dataList" :key="index" @scroll="onScroll">
          <a>
            <div class="cover">
              <img class="cover-img" :src="item['cover']" :alt="item['cover']">
              <p>{{ item['desc'] }}</p>
            </div>
          </a>
          <div class="footer">
            <a>
              <div class="user-head">
                <div><img class="user-head-img" :src="item['user']['avatar']" :alt="item['user']['avatar']"></div>
                <div><p>{{ item['user']['nickName'] }}</p></div>
              </div>
            </a>
            <div class="footer-gap"></div>
            <div class="like">
              <div :class="{'like-icon':true,'liked':item['like']}"></div>
              <div class="like-num">{{ item['thumbs'] }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#info-container {
  margin-left: 15vw;
  width: 100vw;
  display: flex;
  flex-direction: column;
}

.search {
  position: fixed;
  left: 10vw;
}

#user-info {
  margin-top: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.user-info-head {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #ababab;
  margin: 10px;
}

.user-info-head img {
  width: 100%;
  height: 100%;
}

.user-base-info {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
}

.user-info-body {
  padding: 10px;
  display: flex;
  flex-direction: column;
}

#nickname-span {
  font-size: 20px;
  font-weight: bold;
}

.gender-birthday {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #e5e5e5;
  width: 55px;
  height: 20px;
  border-radius: 20px;
  margin: 5px 0;
}

#gender.male {
  background: url("@/assets/icons/male.png");
  background-size: cover;
  width: 12px;
  height: 12px;
  margin: 0 6px;
}

#gender.female {
  background: url("@/assets/icons/female.png");
  background-size: cover;
  width: 12px;
  height: 12px;
  margin: 0 6px;
}

#user-id-ip {
  font-size: 12px;
  margin: 5px 0;
}

.user-info-desc {
  font-size: 14px;
  margin: 5px 0;
}

.user-info-footer {
  font-size: 12px;
  margin: 5px 0;
}

.footer-font {
  font-weight: bold;
}


.back-top {
  position: fixed;
  display: flex;
  right: 20px;
  bottom: 100px;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: white;
  color: #8d8d8d;
  border: 3px solid #8d8d8d;
  z-index: 2;
  cursor: pointer;
}

.back-top .top-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  margin-bottom: 5px;
}

.data-list {
  margin: 0 0;
  position: relative;
}

.data-list:after {
  content: "";
  display: block;
  clear: both;
}

.note-section {
  float: left;
  height: auto;
  padding: 10px 10px;
}

.cover {
  width: 200px;
  height: auto;
  padding: 10px;
  border-radius: 10px;
  display: flex;
  box-shadow: 0 0 5px #ccc;
  border: 1px solid #ccc;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.cover img {
  width: 100%;
  border-radius: 10px;
}

.cover p {
  width: 100%;
  height: auto;
  font-size: 14px;
  margin: 0;
  padding: 10px 20px 10px 20px;
  text-align: start;
  word-wrap: break-word;
  color: black;
  font-weight: bolder;
}

.cover p:hover {
  color: #00b6b6;
}

.footer {
  display: flex;
  flex-direction: row;
  height: 40px;
  justify-content: space-around;
}

.footer .footer-gap {
  width: auto;
}

.footer .like {
  display: flex;
  justify-content: center;
  align-items: center;

}

.footer .user-head {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}


.footer .user-head p {
  width: 100px;
  text-overflow: ellipsis;
  font-size: 12px;
  white-space: nowrap; /* 不换行 */
  overflow: hidden;
  cursor: pointer;
  font-weight: bolder;
}

.footer .user-head p:hover {
  color: #00b6b6;
}

.footer .like .like-num {
  font-size: 12px;
  margin-left: 5px;
}

.footer .user-head img {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin: 10px;
}

.footer .user-head img:hover {
  box-shadow: #00b6b6 0 0 5px;
}

.footer .like .like-icon.liked {
  background-image: url("@/assets/icons/liked.png");
  background-size: cover;
  width: 15px;
  height: 15px;
}

.like-icon {
  cursor: pointer;
}

.footer .like .like-icon {
  background-image: url("@/assets/icons/dislike.png");
  background-size: cover;
  width: 15px;
  height: 15px;
}
</style>