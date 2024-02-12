<template>
  <div class="error-container">
<!--    <Menu class="menu-page"></Menu>-->
    <div class="error-main-container">
      <el-col :sm="12" :lg="6">
        <el-result icon="warning" title="404" sub-title="肥肠抱歉，您访问的页面走丢咯~">
          <template #extra>
            <el-button color="aquamarine" @click="$e=>$router.back()">返回</el-button>
          </template>
        </el-result>
      </el-col>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style>
.error-container{
  display: flex;
  flex-direction: row;
}


.error-main-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 150px;
  margin-left: 100px;
  width: 100vw;
}

</style>