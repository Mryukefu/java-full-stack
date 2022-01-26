<template>
  <div class="navbar-login">
    <div class="navbar-login-btn" @click="showDialog = true">
      <span v-if="loginUser && loginUser.username" class="user-name">
        <img :src="loginUser.avatar" :alt="loginUser.username" width="19" height="19">
        {{loginUser.username}}
      </span>
      <span v-else>登录 / 注册</span>
    </div>
    <div v-if="showDialog" class="navbar-login-dialog" :style="{width: pageWidth, height: pageHeight}">
      <div class="navbar-login-dialog-form">
        <span class="navbar-login-dialog-form-close" @click="showDialog = false">+</span>
        <div class="navbar-login-dialog-form-title">{{ formType }}</div>
        <!-- <img src="/logo-h.png" width="200" alt="mak" class="navbar-login-dialog-form-logo"> -->
        <div class="navbar-login-dialog-form-item">
          <input v-if="formType === '注册'" type="text" v-model="form.username" placeholder="用户名：">
        </div>
        <div class="navbar-login-dialog-form-item">
          <input type="text" v-model="form.mail" placeholder="邮箱：">
        </div>
        <div class="navbar-login-dialog-form-item">
          <input type="password" v-model="form.password" placeholder="密码：">
        </div>
        <div v-if="formType === '注册'" class="navbar-login-dialog-form-item">
          <input type="password" v-model="form.re_password" placeholder="再次输入密码：">
        </div>
        <!-- 从服务器获取验证码 -->
        <div v-if="formType === '登录'" class="navbar-login-dialog-form-captcha">
          <input type="text" v-model.trim="form.captcha" placeholder="验证码：">
          <img v-if="captchaUrl" :src="captchaUrl" alt="验证码" width="100" height="30" @click="getCaptcha">
          <a v-else  href="javascript:;" @click="getCaptcha">点击获取验证码</a>
        </div>
        <!-- 发送验证码到邮箱 -->
        <div v-if="formType === '注册'" class="navbar-login-dialog-form-captcha">
          <input type="text" v-model.trim="form.captcha" placeholder="验证码：">
          <a href="javascript:;" @click="getEmailCaptcha">{{getCodeTimeout === 0 ? '点击获取验证码' : `${getCodeTimeout}秒后可获取`}}</a>
        </div>

        <div class="navbar-login-dialog-form-link">
          <a v-if="formType !== '注册'" href="javascript:;" @click="formType = '注册'">注册</a>
          <a v-if="formType !== '登录'" href="javascript:;" @click="formType = '登录'">登录</a>
          <a v-if="formType !== '忘记密码？'" href="javascript:;" style="float: right" @click="formType = '忘记密码？'">忘记密码？</a>
        </div>
        <!-- <a href="javascript:;" class="navbar-login-dialog-form-btn" :class="{'btn-disabled': form.captcha.length !== 5 || !captchaId}" @click="verifyCaptcha">{{ formType }}</a> -->
        <a v-if="formType === '注册'" href="javascript:;" class="navbar-login-dialog-form-btn" @click="register">注册</a>
        <a v-else-if="formType === '登录'" href="javascript:;" class="navbar-login-dialog-form-btn" @click="login">登录</a>
        <a v-else href="javascript:;" class="navbar-login-dialog-form-btn" @click="register">重置密码</a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import utils from '../../../utils/index.js'
export default {
  data() {
    return {
      showDialog: true,
      formType: '注册',
      form: {
        captcha: '',
        username: '', 
        password: '',
        mail: '',
        re_password: ''
      },
      getCodeTimeout: 0, // 获取邮箱验证码剩下的时间
      captchaUrl: '',
      captchaId: '',
      pageWidth: 0,
      pageHeight: 0,
      loginUser: {},
    }
  },
  mounted() {
    this.pageWidth = window.innerWidth + 'px'
    this.pageHeight = window.innerHeight + 'px'
    this.updateUser()
  },
  watch: {
    getCodeTimeout(time) {
      let timer = null
      if (time === 45) {
        timer = setInterval(() => {
          if (this.getCodeTimeout === 0) {
            clearInterval(timer)
          } else {
            this.getCodeTimeout -= 1
          }
        }, 1000)
      }
    }
  },
  methods: {
    // 获取验证码
    getCaptcha() {
      // this.captchaUrl = '/images/captcha.png'
      const url = "http://127.0.0.1:8000/captcha"
      axios.get(url).then(response => {
        this.captchaUrl = response.data.data.img_src
        this.captchaId = response.data.data.img_id
        // this.getCodeTimeout = 45
      }).catch(err => {
        console.error(err)
        alert('获取验证码失败！')
      })
    },
    // 检测验证码
    verifyCaptcha() {
      let url = "http://127.0.0.1:8000/captcha/check"
      axios.get(url, {params: {img_id: this.captchaId, img_text: this.form.captcha}}).then(response => {
        console.log(response.data)
      }).catch(err => {
        console.error(err)
        alert('获取验证码失败！')
      })
    },
    // 注册
    register() {
      let url = "http://127.0.0.1:8000/user/register"
      axios.post(url, {
        username: this.form.username,
        password: utils.strToMD5(this.form.password),
        mail: this.form.mail,
        verify_code: this.form.captcha
      }).then(res => {
        if (res.data.code !== 10000) {
          alert(res.data.message)
        } else {
          alert('注册成功！')
          this.formType = '登录'
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 登录
    login() {
      let url = "http://127.0.0.1:8000/user/login"
      axios.post(url, {
        password: utils.strToMD5(this.form.password),
        mail: this.form.mail,
        img_id: this.captchaId,
        captcha: this.form.captcha,
      }).then(res => {
        if (res.data.code !== 10000) {
          alert(res.data.message)
        } else {
          this.showDialog = false
          localStorage.setItem('login-user', JSON.stringify(res.data.data))
          this.updateUser()
        }
      }).catch(err => {
        this.getCaptcha()
        console.error(err)
      })
    },
    updateUser() {
      this.loginUser = JSON.parse(localStorage.getItem('login-user'))
    },
    // 注册时获取邮箱验证码
    getEmailCaptcha() {
      if (this.getCodeTimeout !== 0) {
        alert(`请于${this.getCodeTimeout}s后再重新获取邮箱验证码！`)
        return
      }
      let url = "http://127.0.0.1:8000/email/captcha"
      axios.get(url, {params: {mail: this.form.mail}}).then(response => {
        alert(response.data.message)
        this.getCodeTimeout = 45
      }).catch(err => {
        console.error(err)
        alert('获取验证码失败！')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.user-name {
  span, img {
    vertical-align: middle;
  }
  img {
    border-radius: 4px;
  }
}
.navbar-login {
  position: relative;
  cursor: pointer;
  display: inline-block;
  padding: 0 12px;
  border-radius: 18px;
  font-size: 14px;
  &-dialog {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    background-color: rgba($color: #000000, $alpha: .6);
    &-form {
      box-sizing: border-box;
      width: 300px;
      margin: 60px auto;
      padding: 8px;
      border-radius: 8px;
      color: #666;
      background-color: white;
      &-close {
        float: right;
        color: #666;
        font-size: 36px;
        transform: rotate(45deg);
      }
      &-title {
        font-size: 20px;
        font-weight: bold;
        letter-spacing: 4px;
        text-align: center;
        margin-bottom: 22px;
      }
      &-logo {
        margin: 6px 50px;
        width: 200px;
      }
      &-captcha {
        padding: 8px;
        input {
          box-sizing: border-box;
          width: 140px;
          margin-right: 12px;
          color: #666;
          font-size: 16px;
          outline: none !important;
          background-color: rgba($color: #fff, $alpha: 1);
          border: 1px solid rgba($color: #ccc, $alpha: 1);
          padding: 6px;
          vertical-align: top;
        }
      }
      &-item {
          box-sizing: border-box;
          padding: 3px 16px;
          border-radius: 23px;
          border: 2px solid #eee;
          margin-bottom: 6px;
        input {
          width: 100%;
          color: #666;
          font-size: 16px;
          outline: none !important;
          background-color: rgba($color: #fff, $alpha: 1);
          border: none;
        }
      }
      &-link {
        padding: 0 12px;
        a {
          text-decoration: underline;
        }
      }
      &-btn {
        margin-top: 20px;
        display: block;
        letter-spacing: 4px;
        box-sizing: border-box;
        padding: 6px 20px;
        font-size: 18px;
        color: white;
        background-color: #4665ee;
        border-radius: 6px;
        border: none;
        width: 100%;
        text-align: center;
        &:active {
          opacity: .8;
        }
      }
      .btn-disabled {
        opacity: .4;
      }
    }
  }
}
</style>