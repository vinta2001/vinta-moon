<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";
import {userStore} from "@/stores/userStore";
import {scrollStore} from "@/stores/scrollStore";
import {ElMessage} from "element-plus";

let router = useRouter()
const scroll_store = scrollStore();
const user = userStore();

interface MenuItem {
  name: string,
  active: boolean,
  path: string
}

const menuItem = ref([
  {name: '发现', active: false, path: '/explore'},
  {name: '发布', active: false, path: '/publish'},
  {name: '通知', active: false, path: '/notification'},
  {name: '我', active: false, path: '/user'}
])
const menu_more = ref<boolean>(false);
const menu_footer = ref<boolean>(false);


function choose(item: MenuItem) {
  menuItem.value.forEach((element: MenuItem) => {
    element['active'] = element == item
  });
  router.push({path: item['path']});
}

function logout() {
  if (user.getUserId) {
    user.clear()
    ElMessage.success("已退出~")
    setTimeout(() => {
      router.push({path: '/user/login'})
    }, 1000)
  }
}

router.beforeEach((to, from, next) => {
  if (from.fullPath === "/explore") {
    scroll_store.setScrollTop(window.pageYOffset || window.scrollY);
  }
  if (to.fullPath === "/publish" || to.fullPath === "/user/info") {
    if (!user.getUserId) {
      ElMessage.info("请先登录~")
      setTimeout(() => {
        next('/user/login');
      }, 1000)
      return;
    }
  }
  if (to.fullPath === "/user/login") {
    if (user.getUserId) {
      next('/user/info');
      return;
    }
  }
  next();
  return;
})

router.afterEach((to, from, next) => {
  menuItem.value.forEach((ele: any) => {
    ele['active'] = ele['path'].split('/')[1] === to.fullPath.split('/')[1];
  });
})

</script>

<template>
  <div class="menu-container">
    <div class="logo">小蓝书</div>
    <div :class="{'menu-item':true,'active':item['active']}" v-for="(item,index) in menuItem"
         :data-id="menuItem.indexOf(item)"
         @click="choose(item)">{{ item.name }}
    </div>
    <div class="menu-more" :class="(menu_footer||menu_more)?'active':''" @mouseover="menu_more=true;"
         @mouseleave="menu_more=false;">
      <div class="logout">
        <span class="menu-more-item" @click="">其他</span>
        <span class="menu-more-item" @click="logout()">退出</span>
      </div>
    </div>
    <div class="menu-footer" @mouseover="menu_footer=true" @mouseleave="menu_footer=false;">
      更多
    </div>
  </div>
</template>

<style scoped>

.menu-container {
  width: 15vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  height: 100vh;
  position: fixed;
  z-index: 2;
}

.logo {
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 45px;
  font-family: "楷体";
  color: aquamarine;
  font-weight: bolder;
}

.menu-item {
  width: 15vw;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
  border-radius: 50px;
  font-weight: bolder;
  cursor: pointer;
}

.menu-item.active {
  background-color: aquamarine;

}

.menu-footer {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 15vw;
  bottom: 0;
  height: 40px;
  border-radius: 0 15px 0 0;
  font-weight: bolder;
}

.menu-footer:hover {
  cursor: pointer;
  background-color: #dadada;
}

.menu-more {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
  bottom: -500px;
  width: 15vw;
  border-radius: 20px;
  background-color: #dadada;
  transition: 1s;
}

.menu-more:hover {
  cursor: pointer;
  background-color: #dadada;
}

.menu-more.active {
  bottom: 40px;
}

.menu-more-item {
  width: 15vw;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
  border-radius: 50px;
  font-weight: bolder;
  cursor: pointer;
}
</style>