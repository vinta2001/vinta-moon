<script setup lang="ts">
import login from "@/components/login/loginForm.vue";
import register from "@/components/login/registerForm.vue";
import {ref} from "vue";

const veri = ref<boolean>(false);

function onlogin() {
  veri.value = !veri.value;
}

</script>
<template>
<!--  <Menu class="menu-page"></Menu>-->
  <div class="login-container">
    <div :class="{ container: true, 'sign-up-model': veri }">
      <div class="inner-left-container">
        <div class="login-content">
          <div class="app-title" @click="$e=>$router.push('/explore')">
            <h1>vinta moon</h1>
          </div>
          <div class="to-register" @click="onlogin()">去注册</div>
        </div>
      </div>
      <div class="inner-right-container">
        <div class="register-content">
          <div class="app-title" @click="$e=>$router.push('/explore')">
            <h1>vinta moon</h1>
          </div>
          <div class="to-login" @click="onlogin()">去登录</div>
        </div>
      </div>
      <div class="inner-sign-up-container">
        <login :class="{ 'sign-up-model': veri }" @login-success="$e=>{$router.push({path:'/user/info',force: true})}"></login>
        <register :class="{ 'sign-up-model': veri }" @register-success="veri=!veri"></register>
      </div>
    </div>
  </div>
</template>

<style>

.login-container {
  display: flex;
  flex-direction: row;
  position: fixed;
  left: 10vw;
  width: 95vw;
  height: 100vh;
  overflow: hidden;
}

.container {
  width: 100vw;
  height: 100vh;
  background-color: white;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: row;
  z-index: 1;
}

.container::before {
  content: "";
  width: 2000px;
  height: 2000px;
  background-color: aquamarine;
  position: absolute;
  border-radius: 50%;
  transform: translateY(-50%);
  top: -10%;
  right: 48%;
  transition: 2s ease-in-out;
  z-index: 1;
}

.container.sign-up-model::before {
  transform: translate(100%, -50%);
  transition: 2s ease-in-out;
  z-index: 1;
}

.inner-left-container {
  width: 0;
  flex: 1;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 3rem 10% 2rem 10%;
  pointer-events: all;
}

.inner-right-container {
  width: 0;
  flex: 1;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 3rem 10% 2rem 10%;
  pointer-events: none;
}

.login-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.register-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.container.sign-up-model .inner-right-container {
  pointer-events: all;
}

.container.sign-up-model .inner-left-container {
  pointer-events: none;
}

.container .inner-right-container .register-content {
  transform: translateX(500px);
  transition: 2s ease-in-out;
}

.container .inner-left-container .login-content {
  transform: translateX(0px);
  transition: 2s ease-in-out;
}

.container.sign-up-model .inner-right-container .register-content {
  transform: translateX(0px);
  transition: 2s ease-in-out;
}

.container.sign-up-model .inner-left-container .login-content {
  transform: translateX(-1000px);
  transition: 2s ease-in-out;
}

.inner-sign-up-container {
  width: 50%;
  height: 50%;
  position: absolute;
  right: 0;
  top: 25%;
  transition: 2s ease-in-out;
  display: grid;
  grid-template-columns: 1fr;
}

.container.sign-up-model .inner-sign-up-container {
  width: 50%;
  height: 50%;
  top: 25%;
  right: 50%;
  transition: 2s ease-in-out;
}

@media screen and(max-width: 992px) {
  .container {
    flex-direction: column;
  }

  .container::before {
    width: 1500px;
    height: 1500px;
    position: absolute;
    bottom: initial;
    left: initial;
    top: initial;
    right: initial;
    transform: translate(-30%, -80%);
  }

  .inner-left-container {
    height: 0;
    flex: 1;
    width: 100%;
  }

  .inner-right-container {
    height: 0;
    flex: 1;
    width: 100%;
  }
}

.to-login {
  color: white;
  cursor: pointer;
}

.to-register {
  color: white;
  cursor: pointer;
}

.app-title {
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  width: 150px;
  height: 150px;
  border: 1px solid white;
  color: white;
  border-radius: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}
</style>