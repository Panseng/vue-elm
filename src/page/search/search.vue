<template>
  <div class="paddingTop search_page">
    <head-top head-title="搜索" goBack="true"></head-top>
    <form class="search_form">
      <input
        type="search"
        name="search"
        placeholder="请输入商家或美食名称"
        class="search_input"
        v-model="searchValue"
        @input="checkInput"
      >
      <input
        type="submit"
        name="submit"
        class="search_submit"
        @click.prevent="searchTarget('')"
      >
    </form>

    <section v-if="restaurantList.length">
      <h4 class="title_restaurant">商家</h4>
      <ul class="list_container">
        <router-link
          v-for="item in restaurantList"
          :key="item.id"
          :to="{path: '/shop', query:{id:item.id}}"
          tag="li"
          class="list_li"
        >
          <section class="item_left">
            <img :src="imgBaseUrl+ item.image_path" class="restaurant_img">
          </section>
          <section class="item_right">
            <div class="item_right_text">
              <p>
                <span>{{ item.name }}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  width="24"
                  height="14"
                  class="pay_icon"
                >
                  <polygon
                    points="0,14 4,0 24,0 20,14"
                    style="fill:none;stroke:#FF6000;stroke-width:1"
                  ></polygon>
                  <line x1="1.5" y1="12" x2="20" y2="12" style="stroke:#FF6000;stroke-width:1.5"></line>
                  <text x="3.5" y="9" style="fill:#FF6000;font-size:9;font-weight:bold;">支付</text>
                </svg>
              </p>
              <p>月售 {{ item.month_sales || item.recent_order_num }} 单</p>
              <p>{{item.delivery_fee || item.float_minimum_order_amount }} 元起送 / 距离 {{ item.distance }}</p>
            </div>
            <ul class="item_right_deatail">
              <li v-for="activities in item.restaurant_activity" :key="activities.id">
                <span
                  :style="{backgroundColor: '#'+activities.icon_color}"
                  class="activities_icon"
                >{{ activities.icon_name }}</span>
                <span>{{ activities.name }}</span>
                <span class="only_phone">(手机客户端专享)</span>
              </li>
            </ul>
          </section>
        </router-link>
      </ul>
    </section>
    <section class="search_history" v-if="searchHistory.length&&showHistory">
      <h4 class="title_restaurant">搜索历史</h4>
      <ul>
        <li v-for="(item, index) in searchHistory" :key="index" class="history_list">
          <span class="history_text ellipsis" @click="searchTarget(item)">{{ item }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            class="delete_icon"
            @click="deleteHistory(index)"
          >
            <line x1="8" y1="8" x2="18" y2="18" style="stroke:#999;stroke-width:3"></line>
            <line x1="18" y1="8" x2="8" y2="18" style="stroke:#999;stroke-width:3"></line>
          </svg>
        </li>
      </ul>
      <footer class="clear_history" @click="clearAllHistory">清空搜索历史</footer>
    </section>
    <div class="search_none" v-if="emptyResult">很抱歉！无搜索结果</div>
    <foot-guide></foot-guide>
  </div>
</template>

<script>
/* eslint-disable no-useless-return */
import headTop from '@/components/header/head'
import footGuide from '@/components/footer/footGuide'
import { searchRestaurant } from '@/service/getData'
import { imgBaseUrl } from '@/config/env'
import { getStore, setStore } from '@/config/mUtils'
export default {
  data () {
    return {
      geohash: '', // msite页面传递过来的地址信息
      searchValue: '', // 搜索内容
      restaurantList: [], // 搜索返回的结果
      imgBaseUrl, // 图片域名地址
      searchHistory: [], // 搜索历史记录
      showHistory: true, // 是否显示历史记录，只有在返回搜索结果后隐藏
      emptyResult: false // 搜索结果为空时显示
    }
  },
  mounted () {
    this.geohash = this.$route.params.geohash

    // 获取历史记录
    if (getStore('searchHistory')) {
      this.searchHistory = JSON.parse(getStore('searchHistory'))
    }
  },
  components: {
    headTop,
    footGuide
  },
  methods: {
    async searchTarget (historyValue) {
      if (historyValue) {
        this.searchValue = historyValue
      } else if (!this.searchValue) {
        return
      }

      // 隐藏历史记录
      this.showHistory = false

      // 获取搜索结果
      this.restaurantList = await searchRestaurant(
        this.geohash,
        this.searchValue
      )
      this.emptyResult = !this.restaurantList.length

      // 判断搜索结果
      let history = getStore('searchHistory')
      if (history) {
        let checkrepeat = false
        this.searchHistory = JSON.parse(history)
        this.searchHistory.forEach(item => {
          if (item === this.searchValue) {
            checkrepeat = true
          }
        })
        if (!checkrepeat) {
          this.searchHistory.push(this.searchValue)
        }
      } else {
        this.searchHistory.push(this.searchValue)
      }
      setStore('searchHistory', this.searchHistory)
    },

    checkInput () {
      if (this.searchValue === '') {
        this.showHistory = true
        this.restaurantList = []
        this.emptyResult = false
      }
    },

    deleteHistory (index) {
      this.searchHistory.splice(index, 1)
      setStore('searchHistory', this.searchHistory)
    },

    clearAllHistory () {
      this.searchHistory = []
      setStore('searchHistory', this.searchHistory)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/mixin";
.search_page {
  margin-bottom: 2rem;
}
.search_form {
  background-color: #fff;
  padding: .5rem;
  display: flex;
  input {
    height: 1.5rem;
  }
  .search_input {
    flex: 4;
    border: .025rem solid $bc;
    @include sc(.65rem, #333);
    border-radius: .125rem;
    background-color: #f2f2f2;
    font-weight: bold;
    padding: 0 .25rem;
  }
  .search_submit {
    flex: 1;
    border: .025rem solid $bc;
    margin-left: .2rem;
    @include sc(.65rem, #fff);
    border-radius: .125rem;
    background-color: $blue;
    font-weight: bold;
    padding: 0 .25rem;
  }
}
.title_restaurant {
  font-size: .6rem;
  line-height: 2rem;
  text-indent: .5rem;
  font-weight: bold;
  color: #666;
}
.list_container {
  background-color: #fff;
}
.list_li {
  display: flex;
  justify-content: "center";
  padding: .5rem;
  border-bottom: .025rem solid $bc;
  .item_left {
    margin-right: .25rem;
    .restaurant_img {
      @include wh(1.7rem, 1.7rem);
    }
  }
  .item_right {
    font-size: .55rem;
    flex: 1;
    .item_right_text {
      padding-bottom: .25rem;
      border-bottom: .025rem solid $bc;
      p {
        line-height: .9rem;
      }
      .pay_icon {
        margin-bottom: -.08rem;
      }
    }
    .item_right_detail {
      margin-top: .25rem;
      li {
        font-size: 0;
        span {
          font-size: .5rem;
          vertical-align: middle;
          display: inline-block;
          margin-bottom: .2rem;
        }
        .activities_icon {
          @include sc(.5rem, #fff);
          font-weight: bold;
          padding: .04rem;
          border-radius: .15rem;
          margin-right: .125rem;
        }
        .only_phone {
          color: #ff6000;
        }
      }
    }
  }
}
.search_history {
  .history_list {
    background-color: #fff;
    border-bottom: .025rem solid $bc;
    @include font(.7rem, 2rem);
    padding: 0 .3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .history_text {
      display: inline-block;
      width: 80%;
    }
    .delete_icon {
      @include wh(1rem, 1rem);
    }
  }
  .clear_history {
    background-color: #fff;
    color: $blue;
    @include font(.7rem, 2rem);
    font-weight: bold;
    text-align: center;
  }
}
.search_none {
  margin: 0 auto;
  @include font(.65rem, 1.75rem);
  color: #333;
  background-color: #fff;
  text-align: center;
  margin-top: .125rem;
}
</style>
