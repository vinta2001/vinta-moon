<script lang="ts" setup>
import {requestInstance, requestInstance1} from "@/utils/requestUtil";
import {nextTick, onActivated, onMounted, reactive, ref} from "vue";
import {ArrowUp, Loading} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import type {PageConfig, NaviItem} from '@/interface/mainPage'
import {scrollStore} from "@/stores/scrollStore";
import {getMediaList} from "@/api/pictureApi";
// 变量定义区
let pageConfig = reactive<PageConfig>({
  isPageLoaded: false,
  currentPage: 1,
  pageSize: 10,
  dataList: [],
  imageWidth: 220,
  colHeights: [0, 0, 0, 0],
  currentType: '推荐',
  isOnTop: true
})
const scroll_store = scrollStore();


// '美食','美妆','时尚','技能','影视','职场','情感','家居','游戏','旅行'
let naviItem = ref<NaviItem[]>([{'name': '推荐', 'active': true}, {'name': '穿搭', 'active': false},
  {'name': '美食', 'active': false}, {'name': '美妆', 'active': false}, {'name': '时尚', 'active': false}
  , {'name': '技能', 'active': false}, {'name': '影视', 'active': false}, {'name': '职场', 'active': false},
  {'name': '情感', 'active': false}, {'name': '家居', 'active': false}, {'name': '游戏', 'active': false},
  {'name': '旅行', 'active': false}])


function changeNaviItem(index: number) {
  pageConfig.isPageLoaded = true
  for (let i = 0; i < naviItem.value.length; i++) {
    if (i == index) {
      naviItem.value[i]['active'] = true
      pageConfig.currentType = naviItem.value[i]['name']
      pageConfig.dataList = []
      getData()
    } else {
      naviItem.value[i]['active'] = false
    }
  }
}

function getData() {
  const query = {
  "pageSize": pageConfig.pageSize,
  "pageNum": pageConfig.currentPage,
  "total": 0,
  "category": "",
  "searchKey": "",
  "cursorScore": "",
  "userId": ""
}
  getMediaList(query).then((res) => {
    const items = res.data.data;
    items.forEach((item: any) => {
      pageConfig.dataList.push(item)
    })
    pageConfig.currentPage += 1
  }).catch((error) => {
        if (error.code === "ERR_NETWORK") {
          ElMessage.error("网络错误")
        }
      }
  ).finally(() => {
    nextTick(() => {
      waterFull()
    })
    pageConfig.isPageLoaded = false
  })
}

function waterFull() {
  let container = null;
  if (document.querySelector('.data-list')) {
    container = document.querySelector('.data-list');
  }
  // 可视区域高度
  const clientWidth = document.documentElement.clientWidth - 300;
  const sections: HTMLElement[] = Array.from(document.querySelectorAll('.note-section'));
  const itemWidth = sections[0].offsetWidth;
  let colNum = 5;
  (container as HTMLElement).style.width = itemWidth * colNum + 'px';
  let itemHeights = [];
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

function load() {
  getData()
}

getData()

onActivated(() => {
  nextTick(() => {
    window.scrollTo(0, scroll_store.getScrollTop ? scroll_store.getScrollTop : 0)
  })
})

onMounted(() => {
  window.addEventListener("scroll", onScroll)
})

</script>
<template>
  <div class="main-page-container" @scroll="onScroll">
    <div class="navigator-container" ref="wrapper">
      <div :class="{'navigator':true,'active':item['active']}" v-for="(item,index) in naviItem"
           @click="changeNaviItem(index)">
        {{ item['name'] }}
      </div>
    </div>
    <div class="loading" v-show="pageConfig.isPageLoaded">
      <Loading class="loading-icon"></Loading>
    </div>
    <div class="data-list" v-infinite-scroll="load" infinite-scroll-distance="10" ref="scrollContainer"
         @scroll="onScroll">
      <div class="back-top" v-show="!pageConfig.isOnTop" @click="toTop">
        <ArrowUp class="top-icon"></ArrowUp>
      </div>
      <div class="note-section" v-for="(item,index) in pageConfig.dataList" :key="index" @scroll="onScroll">
        <a>
          <div class="cover">
            <img class="cover-img" :src="item['cover']">
            <p>{{ item['desc'] }}</p>
          </div>
        </a>
        <div class="footer">
          <a>
            <div class="user-head">
              <div><img class="user-head-img" :src="item['user']['avatar']"></div>
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
</template>

<style>

.main-page-container {
  margin-top: 100px;
  margin-left: 250px;
  width: 80vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
}


.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 80%;
  background-color: white;
}

.loading-icon {
  width: 30px;
  color: grey;
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

.navigator-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-bottom: 10px;
}

.navigator {
  width: 50px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
  border-radius: 50px;
  cursor: pointer;
}

.navigator.active {
  font-weight: bolder;
  background-color: aquamarine;
  transition: .5s ease-in-out;
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
