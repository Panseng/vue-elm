<template>
  <div id="top">
    <head-top signin-up="home">
      <span slot="logo" class="head_logo" @click="reload">ele.me</span>
    </head-top>
    <nav class="city_nav">
      <div class="city_tip">
        <span>当前定位城市：</span>
        <span>定位不准时，请在城市列表中选择</span>
      </div>
      <router-link :to="'/city/'+guessCityid" class="guess_city">
        <span>{{ guessCity }}</span>
        <svg class="arrow_right">
          <use xlink="http://www.w3.org/1999/xlink" href="#arrow-right"></use>
        </svg>
      </router-link>
    </nav>
    <section id="hot_city_container">
      <h4 class="city_title">热门城市</h4>
      <ul class="citylistul clear">
        <router-link
          tag="li"
          v-for="item in hotcity"
          :to="'/city/'+item.id"
          :key="item.id"
        >
          {{ item.name }}
        </router-link>
      </ul>
    </section>
    <section class="group_city_container">
      <ul class="letter_classify">
        <li
          v-for="(value, key, index) in sortgroupcity"
          :key="key"
          class="letter_classify_li"
        >
          <h4 class="city_title" :id="'alpha-'+key">
            {{ key }}
            <span v-if="index == 0">(按字母排序)</span>
          </h4>
          <ul class="groupcity_name_container citylistul clear">
            <router-link
              tag="li"
              v-for="item in value"
              :to="'/city/'+item.id"
              :key="item.id"
              class="ellipsis"
            >
              {{ item.name }}
            </router-link>
          </ul>
        </li>
      </ul>
    </section>
    <!-- alphabet navigation -->
    <section class="jump_alphabet">
      <ul class="alphalistul">
        <li>
          <a href="#top">^</a>
        </li>
        <li v-for="item in alphabet" :key="item">
          <a :href="'#alpha-'+item">{{ item }}</a>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import headTop from '@/components/header/head'
import { cityGuess, groupcity, hotcity } from '@/service/getData'

export default {
  name: 'home',
  data () {
    return {
      guessCity: '',
      guessCityid: '',
      hotcity: [],
      groupcity: {},
      alphabet: []
    }
  },

  mounted () {
    cityGuess().then(res => {
      this.guessCity = res.name
      this.guessCityid = res.id
    })
    hotcity().then(res => {
      this.hotcity = res
    })
    groupcity().then(res => {
      this.groupcity = res
    })
  },

  components: {
    headTop
  },

  computed: {
    // 排序
    /* eslint-disable */
    sortgroupcity () {
      let sortobj = {}
      let alp = ''
      for (let i = 65; i <= 90; i++) {
        alp = String.fromCharCode(i)
        // 利用Unicode 数字编码 转换为大写字母
        if (this.groupcity[alp]) {
          this.alphabet.push(alp)
          sortobj[String.fromCharCode(i)] = this.groupcity[String.fromCharCode(i)]
        }
      }
      return sortobj
    }
  },

  methods: {
    // 重载界面
    reload () {
      window.location.reload()
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../style/mixin';

.head_logo{
  left: 0.4rem;
  font-weight: 400;
  @include sc(0.7rem, #fff);
  @include wh(2.3rem, 0.7rem);
  @include ct;
}
.city_nav{
  padding-top: 2.35rem;
  border-top: 1px solid $bc;
  background-color: #fff;
  margin-bottom: 0.4rem;
  .city_tip{
    @include fj;
    line-height: 1.45rem;
    padding: 0 0.45rem;
    span:nth-of-type(1){
      @include sc(0.55rem, #666);
    }
    span:nth-of-type(2){
      font-weight: 900;
      @include sc(0.475rem, #9f9f9f);
    }
  }
  .guess_city{
    @include fj;
    align-items: center;
    height: 1.8rem;
    padding: 0 0.45rem;
    border-top: 1px solid $bc;
    border-bottom: 2px solid $bc;
    @include font(0.75rem, 1.8rem);
    span:nth-of-type(1){
      color: $blue;
    }
    .arrow_right{
      @include wh(.6rem, .6rem);
      fill: #999;
    }
  }
}
#hot_city_container{
  background-color: #fff;
  margin-bottom: .4rem;
}
.citylistul{
  li{
    float: left;
    text-align: center;
    color: $blue;
    border-bottom: .025rem solid $bc;
    border-right: .025rem solid $bc;
    @include wh(25%, 1.75rem);
    @include font(.6rem, 1.75rem);
  }
  li:nth-of-type(4n){
    border-right: none;
  }
}
.city_title{
  color:#666;
  font-weight: 400;
  text-indent: 0.45rem;
  border-top: 1px solid $bc;
  border-bottom: 1px solid $bc;
  @include font(.55rem, 1.45rem, "Helvetica Neue");
  span{
    @include sc(.475rem, #999);
  }
}
.letter_classify_li{
  margin-bottom: .4rem;
  background-color: #fff;
  border-bottom: 1px solid $bc;
  .groupcity_name_container{
    li{
      color: #666;
    }
  }
}
.jump_alphabet{
  position: fixed;
  right: 1rem;
  top: 0;
  height: 100%;
  .alphalistul{
    color: #999;
    opacity: .5;
    height: 60%;
    width: .8rem;
    text-align: center;
    @include font(.4rem, .6rem);
    @include ct;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
}
</style>
