<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";
import {userStore} from "@/stores/userStore";
import {scrollStore} from "@/stores/scrollStore";


let router = useRouter()
const user_store = userStore();
const scroll_store = scrollStore()

interface MenuItem {
  name: string,
  active: boolean,
  path: string
}

const menuItem = ref([{name: '发现', active: false, path: '/explore'}, {name: '发布', active: false, path: '/create'}, {
  name: '通知',
  active: false,
  path: '/notification'
}, {name: '我', active: false, path: '/user'}])

menuItem.value.forEach((ele: any, index: number, arr: any) => {
  ele['active'] = ele['path'].split('/')[1] === router.currentRoute.value.fullPath.split('/')[1];
})

const choose = (item: MenuItem) => {
  menuItem.value.forEach((element: MenuItem) => {
    element['active'] = element == item
  });
  if (item['name'] == '我') {
    user_store.getUserId == null ? router.push({path: '/user/login'}) : router.push({path: '/user/info'});
  } else {
    router.push({path: item['path']});
  }
}

router.beforeEach((to: any, from: any, next: any) => {
  menuItem.value.forEach((ele: any, index: number, arr: any) => {
    ele['active'] = ele['path'].split('/')[1] === to.fullPath.split('/')[1];
  })
  next()
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
  width: 250px;
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
  width: 200px;
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