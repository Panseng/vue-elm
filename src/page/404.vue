<template>
  <div class="error-page">
    <head-top head-title="404" goBack="true"></head-top>
    <div class="error-container">
      <img src="../images/404.png">
      <div class="text">
        <p class="message">抱歉！该页面暂未开发...</p>
        <p class="info">作者：APan</p>
        <p class="info">E-Mail：panseng.dr@qq.com</p>
        <p  class="info">Tel: 13725593935</p>
      </div>
    </div>
  </div>
</template>

<script>
import headTop from '@/components/header/head'
export default {
  components: {
    headTop
  }
}
</script>

<style lang="scss" scoped>
@import '../style/mixin';
.error-page{
  .error-container{
    @include center;
    width: 100%;
    text-align: center;
    img{
      @include wh(90%, auto)
    }
    .text{
      @include cl;
      width: 80%;
      p{
        text-align: start;
        padding: 0 10%;
      }
    }
    .message{
      font-size: 1rem;
    }
    .info{
      @include sc(.65rem, $blue)
    }
  }
}
</style>
