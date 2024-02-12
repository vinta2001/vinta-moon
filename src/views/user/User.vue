<script setup lang="ts">
import {userStore} from "@/stores/userStore";
const user_store = userStore()

</script>

<template>
     <div class="user-container">
        <router-view></router-view>
     </div>
</template>

<style scoped>

.user-container{
  display: flex;
  flex-direction: row;
  overflow: hidden;
}

</style>