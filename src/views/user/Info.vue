<script setup lang="ts">
import {userStore} from "@/stores/userStore";
import {useRouter} from "vue-router";
import {onActivated, onMounted} from "vue";
const router = useRouter()
const user_store = userStore()

function isLogin() {
  if(!user_store.getUserId){
    router.push("/user/login")
  }
}

onMounted(()=>{
  isLogin()
})

</script>

<template>
  <div class="info-container">
    info
  </div>
</template>

<style scoped>

</style>