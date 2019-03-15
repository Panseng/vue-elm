<template>
  <div class="loginContainer">
    <head-top :head-title="loginWay? '登录':'密码登录'" goBack="true">
    </head-top>
    <form class="loginForm" v-if="loginWay">
      <section class="input-container phone-number">
        <input
          type="text"
          placeholder="账号密码随便输入"
          name="phone"
          maxlength="11"
          v-model="phoneNumber"
        >
        <button
          @click.prevent="getVerifyCode"
          :class="{right_phone_number:rightPhoneNumber}"
          v-show="!computedTime"
        >获取验证码</button>
        <span v-show="computedTime">已发送</span>
      </section>

      <section class="input-container">
        <input type="text" placeholder="验证码" name="mobileCode" maxlength="6" v-model="mobileCode">
      </section>
    </form>

    <!-- 账号密码 -->
    <form class="loginForm" v-else>
      <section class="input-container">
        <input type="text" placeholder="账号" v-model.lazy="userAccount">
      </section>
      <section class="input-container">
        <input v-if="!showPassword" type="password" placeholder="密码" v-model="passWord">
        <input v-else type="text" placeholder="密码" v-model="passWord">
        <div class="button-switch" :class="{change_to_text:showPassword}">
          <div class="circle-button" :class="{trans_to_right:showPassword}" @click="changePassWordType"></div>
          <span>abc</span>
          <span>...</span>
        </div>
      </section>
      <section class="input-container captcha-code-container">
        <input type="text" placeholder="验证码" maxlength="4" v-model="codeNumber">
        <div class="img-change-img">
          <img v-show="captchaCodeImg" :src="captchaCodeImg">
          <div class="change-img" @click="getCaptchaCode">
            <p>看不清</p>
            <p>换一张</p>
          </div>
        </div>
      </section>
    </form>
    <p class="login-tips">
      试用账号：12345678932
    </p>
    <p class="login-tips">
      试用密码：elmtest.2019
    </p>
    <div class="login-container" @click="mobileLogin">登录</div>
    <div class="change-login" @click="changeLoginWay">
        {{ loginWay? "密码登录":"短信登陆" }}
    </div>
    <router-link to="/forget" class="to-forget" v-if="!loginWay">重置密码?</router-link>
    <alert-tip
      v-if="showAlert"
      :showHide="showAlert"
      @closeTip="closeTip"
      :alertText="alertText"
    ></alert-tip>
  </div>
</template>

<script>
import headTop from '@/components/header/head'
import alertTip from '@/components/common/alertTip'
import { mapMutations } from 'vuex'
import { mobileCode, checkExsis, sendLogin, getcaptchas, accountLogin } from '@/service/getData'

/* eslint-disable no-useless-return */
export default {
  data () {
    return {
      loginWay: false, // 登陆方式，默认短信登录
      showPassword: false, // 显示密码？
      phoneNumber: null,
      mobileCode: null, // 短信验证码
      validate_token: null, // 获取短信时返回的验证值
      computedTime: 0, // 倒计时
      userInfo: null,
      userAccount: null, // 用户名
      passWord: null,
      captchaCodeImg: null,
      codeNumber: null,
      showAlert: false,
      alertText: null
    }
  },
  created () {
    this.getCaptchaCode()
  },
  components: {
    headTop,
    alertTip
  },
  computed: {
    rightPhoneNumber: function () {
      return /^1\d{10}$/gi.test(this.phoneNumber)
    }
  },
  methods: {
    ...mapMutations([
      'RECORD_USERINFO'
    ]),

    // 登陆方式
    changeLoginWay () {
      this.loginWay = !this.loginWay
    },

    // 是否显示密码
    changePassWordType () {
      this.showPassword = !this.showPassword
    },

    // 获取验证码
    async getCaptchaCode () {
      let res = await getcaptchas()
      this.captchaCodeImg = res.code
    },

    // 获取短信验证码
    async getVerifyCode () {
      if (this.rightPhoneNumber) {
        this.computedTime = 30
        this.timer = setInterval(() => {
          this.computedTime--
          if (this.computeTime === 0) {
            clearInterval(this.timer)
          }
        }, 1000)

        // 判断用户是否存在
        let exsis = await checkExsis(this.phoneNumber, 'mobile')
        if (exsis.message) {
          this.showAlert = true
          this.alertText = exsis.message
          return
        } else if (!exsis.is_exsis) {
          this.showAlert = true
          this.alertText = '您输入的手机号尚未绑定'
          return
        }

        // 短信验证码
        let res = await mobileCode(this.phoneNumber)
        if (res.message) {
          this.showAlert = true
          this.alertText = res.message
          return
        }
        this.validate_token = res.validate_token
      }
    },

    // 登录
    async mobileLogin () {
      if (this.loginWay) {
        if (!this.rightPhoneNumber) {
          this.showAlert = true
          this.alertText = '手机号码不正确'
        } else if (!/^\d{6}$/gi.test(this.mobileCode)) {
          this.showAlert = true
          this.alertText = '短信验证码不正确'
          return
        }

        // 手机号登陆  此处应该有一个判断校验
        this.userInfo = await sendLogin((this.mobileLogin, this.phoneNumber, this.validate_token))
      } else {
        if (!this.userAccount) {
          this.showAlert = true
          this.alertText = '请输入手机号/邮箱/用户名'
          return
        } else if (!this.passWord) {
          this.showAlert = true
          this.alertText = '请输入密码'
          return
        } else if (!this.codeNumber) {
          this.showAlert = true
          this.alertText = '请输入验证码'
          return
        }

        // 用户密码登录
        this.userInfo = await accountLogin(this.userAccount, this.passWord, this.codeNumber)
      }

      // 校验返回值
      if (!this.userInfo.user_id) {
        this.showAlert = true
        this.alertText = this.userInfo.message
        if (!this.loginWay) this.getcaptchaCode()
      } else {
        this.RECORD_USERINFO(this.userInfo)
        this.$router.go(-1)
      }
    },
    closeTip () {
      this.showAlert = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/mixin";

.loginContainer {
  padding-top: 1.95rem;
  p,
  span,
  input {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
}
.loginForm {
  background-color: #fff;
  margin-top: 0.6rem;
  .input-container {
    display: flex;
    justify-content: space-between;
    padding: 0.6rem 0.8rem;
    border-bottom: 1px solid #f1f1f1;
    input {
      @include sc(0.7rem, #666);
    }
    button {
      @include sc(0.65rem, #fff);
      font-family: Helvetica Neue, Tahoma, Arial;
      padding: 0.28rem 0.4rem;
      border: 1px;
      border-radius: 0.15rem;
    }
    .right_phone_number {
      background-color: #4cd964;
    }
  }
  .phone-number {
    padding: 0.3rem 0.8rem;
  }
  .captcha-code-container {
    height: 2.2rem;
    .img-change-img {
      display: flex;
      align-items: center;
      img {
        @include wh(3.5rem, 1.5rem);
        margin-right: 0.2rem;
      }
      .change-img {
        display: flex;
        flex-direction: "column";
        flex-wrap: wrap;
        width: 2rem;
        justify-content: center;
        p {
          @include sc(0.55rem, #666);
        }
        p:nth-of-type(2) {
          color: #3b95e9;
          margin-top: 0.2rem;
        }
      }
    }
  }
}
.login-tips {
  @include sc(0.5rem, red);
  padding: 0.4rem 0.6rem;
  line-height: 0.5rem;
  a {
    color: #3b95e9;
  }
}
.login-container {
  margin: 0 0.5rem 1rem;
  @include sc(0.7rem, #fff);
  background-color: #4cd964;
  padding: 0.5rem 0;
  border: 1px;
  border-radius: 0.15rem;
  text-align: center;
}
.button-switch {
  background-color: #ccc;
  display: flex;
  justify-content: center;
  @include wh(2rem, 0.7rem);
  padding: 0 0.2rem;
  border: 1px;
  border-radius: 0.5rem;
  position: relative;
  .circle-button {
    transition: all 0.3s;
    position: absolute;
    top: -0.2rem;
    z-index: 1;
    left: -0.3rem;
    @include wh(1.2rem, 1.2rem);
    box-shadow: 0 0.026667rem 0.053333rem 0 rgba(0, 0, 0, 0.1);
    background-color: #f1f1f1;
    border-radius: 50%;
  }
  .trans_to_right {
    transform: translateX(1.3rem);
  }
  span {
    @include sc(0.45rem, #fff);
    transform: translateY(0.05rem);
    line-height: 0.6rem;
  }
  span:nth-of-type(2) {
    transform: translateY(-0.08rem);
  }
}
.change_to_text {
  background-color: #4cd964;
}
.to-forget {
  float: right;
  @include sc(0.6rem, #3b95e9);
  margin-right: 0.3rem;
}
.change-login {
  width: 100%;
  text-align: center;
  @include sc(0.7rem, $blue);
}
</style>
