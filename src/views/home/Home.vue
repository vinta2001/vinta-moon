<script setup lang="ts">
import MainPage from "@/components/home/mainPage.vue";
import Search from "@/components/home/search.vue";


</script>

<template>
 <div>
<!--    <Menu class="menu-page"></Menu>-->
    <div class="home-main-container">
      <Search></Search>
      <MainPage></MainPage>
  </div>
 </div>
</template>

<style>
.home-main-container {
  display: flex;
  flex-direction: column;
  width: 80vw;
}
</style>

