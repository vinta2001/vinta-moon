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

const choose = (item: MenuItem) => {
  menuItem.value.forEach((element: MenuItem) => {
    element['active'] = element == item
  });
  router.push({path: item['path']});
}

router.beforeEach((to, from, next) => {
  if (from.fullPath === "/explore") {
    scroll_store.setScrollTop(window.pageYOffset || window.scrollY);
  }
  if (to.fullPath === '/publish' || to.fullPath==='/user/info') {
    if (!user.getUserId) {
      ElMessage.info("需要登记信息哦~")
      next('/user/login');
    }
  }
  if(to.fullPath==='/user/login'){
    if(user.getUserId){
      next('/user/info')
    }
  }
  menuItem.value.forEach((ele: any) => {
    ele['active'] = ele['path'].split('/')[1] === to.fullPath.split('/')[1];
  });
  next()
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
  border-radius: 20px;
  font-weight: bolder;
  cursor: pointer;
}

.menu-item.active {
  background-color: aquamarine;

}

</style>