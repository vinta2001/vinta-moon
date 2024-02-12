<script setup lang="ts">
import {ref} from "vue";
import {Search} from "@element-plus/icons-vue";

const searchWords = ref<string>('最适合i人的年会');

</script>

<template>
  <div class="search-container">
    <div class="search-box">
      <input class="search-input" type="text" v-bind:placeholder="searchWords">
      <div class="search-icon-box">
        <Search class="search-icon"></Search>
      </div>
    </div>
  </div>
</template>

<style scoped>


.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  z-index: 1;
  position: fixed;
  background-color: white;
  background-color: white;
}


.search-box {
  width: 500px;
  height: 50px;
  margin: 20px;
  display: flex;
  border-radius: 30px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #d3d3d3;
}

.search-input {
  width: 450px;
  height: 50px;
  font-size: 16px;
  border: none;
  padding: 0 20px;
  border-radius: 30px 0 0 30px;
  background-color: #d3d3d3;

}

.search-input:focus {
  outline: none;
}

.search-icon-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 0 30px 30px 0;
  background-color: #d3d3d3;

}

.search-icon {
  width: 30px;
  height: auto;
  color: grey;
}

</style>