<script setup lang="ts">
import {Lock, User} from "@element-plus/icons-vue";
import type {RegiserReq} from "@/interface/user";
import {reactive, ref} from "vue";
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from "element-plus";
import {userRegister} from "@/api/userApi";
import {getEmailCode} from "@/api/codeApi";

const emit = defineEmits(['registerSuccess']);
const registerParam: RegiserReq = reactive({
  email: "",
  password: "",
  password1: "",
  emailCode: ""
});

let button_text = reactive({
  text: "获取验证码",
  disabled: false,
  time: 60
})

const register = () => {
  registerRef.value?.validate((valid) => {
    if (!valid) {
      return false;
    }
    //校验通过
    userRegister(registerParam.email, registerParam.password, registerParam.emailCode).then(
        (res: any) => {
          if (res['code'] === 200) {
            ElMessage.success(res['message'])
            emit('registerSuccess');
          } else {
            ElMessage.error(res['message'])
          }
        }
    ).catch((error: any) => {
      ElMessage.error("注册失败")
    })
  });
};

const isEmail = (rule: any, value: any, callback: any) => {
  const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
  if (reg.test(value)) {
    callback();
  } else {
    callback(new Error("邮箱格式不正确"));
  }
};

const isSamePassword = (rule: any, value: any, callback: any) => {
  if (registerParam.password === value) {
    callback();
  } else {
    callback(new Error("两次输入的密码不一致"));
  }
};

const registerRef = ref<FormInstance>();
const registerRules = reactive<FormRules>({
  email: [
    {required: true, message: "账号不能为空", trigger: "blur"},
    {validator: isEmail, trigger: "blur"},
  ],
  password: [
    {required: true, message: "密码不能为空", trigger: "blur"},
    {
      required: true,
      message: "密码长度为6~20",
      min: 6,
      max: 20,
      trigger: "blur",
    },
  ],
  password1: [
    {required: true, message: "密码不能为空", trigger: "blur"},
    {
      required: true,
      message: "密码长度为6~20",
      min: 6,
      max: 20,
      trigger: "blur",
    },
    {validator: isSamePassword, trigger: "blur"},
  ],
  emailCode: [
    {required: true, message: "验证码不能为空", trigger: "blur"},
  ],
});

const sendEmailCode = () => {
  console.log("send email code")
  registerRef.value?.validateField('email', () => {
  }).then((validate: any) => {
    if (!validate) {
      return false;
    }

    button_text.text = "发送中"
    getEmailCode(registerParam['email']).then((res: any) => {
      if (res['code'] === 200) {
        ElMessage.success(res['message'])
        button_text.disabled = true
        const timer = setInterval(() => {
          button_text.time -= 1
          if (button_text.time === 0) {
            button_text.text = "获取验证码"
            button_text.disabled = false
            button_text.time = 60
            clearInterval(timer)
          }
        }, 1000)
      } else {
        throw new Error(res['message'])
      }
    }).catch((error) => {
      button_text.text = "获取验证码"
      ElMessage.error(error.message)
    })
  })
}

</script>

<template>
  <ElForm class="register-form" ref="registerRef" :model="registerParam" :rules="registerRules">
    <h1 class="register-title">注册</h1>
    <ElFormItem prop="email">
      <ElInput placeholder="请输入邮箱" :prefix-icon="User" v-model="registerParam.email"></ElInput>
    </ElFormItem>
    <ElFormItem prop="password">
      <ElInput placeholder="请输入密码" show-password :prefix-icon="Lock" v-model="registerParam.password"></ElInput>
    </ElFormItem>
    <ElFormItem prop="password1">
      <ElInput placeholder="请确认密码" show-password :prefix-icon="Lock" v-model="registerParam.password1"></ElInput>
    </ElFormItem>
    <div class="verify-box">
      <div class="emailCode-box">
        <ElFormItem prop="emailCode">
          <ElInput placeholder="请输入验证码"
                   v-model="registerParam.emailCode"></ElInput>
        </ElFormItem>
      </div>
      <div>
        <el-button style="margin-left:10px;width: 100px" :disabled="button_text.disabled" @click="sendEmailCode()">
          {{ button_text.disabled ? `${button_text.time}s后尝试` : button_text.text }}
        </el-button>
      </div>
    </div>
    <ElFormItem>
      <el-button color="aquamarine" class="register-btn" @click="register">注册</el-button>
    </ElFormItem>
  </ElForm>
</template>


<style scoped>

.emailCode-box {
  width: 450px;
}

.verify-box {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
}

.register-form {
  grid-row: 1;
  grid-column: 1;
  opacity: 0;
  transition: 1s ease-in-out;
  z-index:0;
  padding: 0 30%;
}

.register-form.sign-up-model {
  grid-row: 1;
  grid-column: 1;
  opacity: 1;
  transition: 2s ease-in-out;
  transition-delay: 0.5s;
  z-index:1;
}

.register-title {
  text-align: center;
}

.register-btn {
  width: 100%;
}
</style>
