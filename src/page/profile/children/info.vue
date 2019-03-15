<template>
  <div class="rating_page">
    <head-top head-title="登出" go-back="true"></head-top>
    <div class="info-container">
      <div class="user" v-if='isEnter'>
        <img class="avatar" :src="imgBaseUrl+userInfo.avatar">
        <p class="user-name">昵称：{{ username }}</p>
      </div>
      <div class="exitlogin" @click="outLogin"><p>退出登录</p></div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import headTop from '@/components/header/head'
import { signout } from '@/service/getData'
import { imgBaseUrl } from '@/config/env'
import { removeStore } from '@/config/mUtils'
export default {
  data () {
    return {
      username: '',
      avatar: '',
      isEnter: '', // 是否已登录
      imgBaseUrl
    }
  },
  components: {
    headTop
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapMutations(['OUT_LOGIN']),

    async outLogin () {
      this.OUT_LOGIN()
      this.$router.go(-1)
      removeStore('user_id')
      await signout()
    }
  },
  watch: {
    userInfo: function (value) {
      if (value && value.user_id) {
        this.username = value.username
        this.avatar = value.avatar
        this.isEnter = true
      } else {
        this.isEnter = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/style/mixin.scss';
.rating_page{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f2f2f2;
  z-index: 202;
  padding-top: 1.95rem;
  .info-container{
    @include center;
    text-align: center;
    font-size: .8rem;
    img{
      @include wh(5rem, 5rem);
      border-radius: 50%;
    }
    .exitlogin{
      margin: .5rem;
      background-color: $blue;
      height: 1.5rem;
      border-radius: 6px;
      p{
        position: relative;
        top:50%;
        transform: translateY(-50%);
        color: white;
      }
    }
  }
}
</style>
