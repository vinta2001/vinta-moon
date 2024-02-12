<script setup lang="ts">
import {Lock, User} from "@element-plus/icons-vue";
import type{LoginReq} from "@/interface/user";
import {reactive, ref} from "vue";
import {ElMessage} from 'element-plus';
import type {FormInstance, FormRules} from 'element-plus';
import {userLogin} from "@/api/userApi";
import {userStore} from '@/stores/userStore';
const emit = defineEmits(['loginSuccess']);
const loginParam: LoginReq = reactive({
  email: "",
  password: "",
});
const user_store = userStore()
const loginRef = ref<FormInstance>();
const loginRules: FormRules = reactive<FormRules>({
  email: [{required: true, message: "请输入账号", trigger: "blur"}],
  password: [{required: true, message: "请输入密码", trigger: "blur"}],
})

const login = () => {
  //校验用户名和密码是否为空
  loginRef.value?.validate((valid) => {
    if (!valid) {
      return false;
    }
    //校验通过
    userLogin(loginParam.email, loginParam.password).then(((res:any) => {
      if(res['message']!=='success'){
        throw new Error("登录失败")
      }
      user_store.setUserName(res['data']['username'])
      user_store.setEmail(res['data']['email'])
      user_store.setToken(res['data']['token'])
      user_store.setUserId(res['data']['id'])
      emit('loginSuccess');
      // console.log(res)
    })).catch((error) => {
      ElMessage.error('登录失败')
    });
  })
}

</script>

<template>
  <ElForm class="login-form" ref="loginRef" :model="loginParam" :rules="loginRules">
    <h1 class="login-title">登录</h1>
    <ElFormItem prop="email">
      <ElInput placeholder="请输入账号" :prefix-icon="User" v-model="loginParam.email"></ElInput>
    </ElFormItem>
    <ElFormItem prop="password">
      <ElInput placeholder="请输入密码" show-password :prefix-icon="Lock" v-model="loginParam.password"></ElInput>
    </ElFormItem>
    <ElFormItem>
      <el-button color="aquamarine" class="login-btn" @click="login">登录</el-button>
    </ElFormItem>
  </ElForm>
  <!-- <div></div> -->
</template>

<style scoped>
.login-form {
  grid-row: 1;
  grid-column: 1;
  opacity: 1;
  transition: 1s ease-in-out;
  transition-delay: 1s;
  padding: 0 30%;

  pointer-events: all;
}

.login-form.sign-up-model {
  grid-row: 1;
  grid-column: 1;
  opacity: 0;
  transition-delay: 3s;
  transition: 2s ease-in-out;
  pointer-events: none;
}

.login-title {
  text-align: center;
}

.login-btn {
  width: 100%
}
</style>