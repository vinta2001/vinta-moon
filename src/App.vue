<script setup lang="ts">
import Menu from "@/components/home/menu.vue";

</script>

<template>
  <div class="app-container">
    <Menu></Menu>
    <router-view v-slot="{ Component }" class="app-main">
      <keep-alive include="Home">
        <component :is="Component" />
      </keep-alive>
    </router-view>
<!--    <router-view></router-view>-->
  </div>
</template>

<style>

.app-container {
  display: flex;
  flex-direction: row;
}
Menu{
  z-index: 0;
  width: 25vw;
}


</style>