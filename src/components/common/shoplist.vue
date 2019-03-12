<template>
  <div class="shoplist_container">
    <ul v-load-more="loaderMore" v-if="shopListArr.length" type="1">
      <router-link v-for="item in shopListArr" :key="item.id" tag="li" :to="{path: 'shop', query:{geohash, id:item.id}}" class="shop_li">
        <section>
          <img :src="imgBaseUrl+item.image_path" class="shop_img">
        </section>
        <hgroup class="shop_right">
          <header class="shop_detail_header">
            <h4 :class="item.is_premium? 'premium':''" class="shop_title_ellipsis">{{ item.name }}</h4>
            <ul class="shop_detail_ul">
              <li v-for="item in item.supports" :key="item.id" class="supports">{{ item.icon_name }}</li>
            </ul>
          </header>
          <h5 class="rating_order_num">
            <section class="rating_order_num_left">
              <section class="rating_section">
                <rating-star :rating="item.rating"></rating-star>
                <span class="rating_num">{{ item.rating }}</span>
              </section>
              <section class="order_section">
                月售{{ item.recent_order_num }}单
              </section>
            </section>
            <section class="rating_order_num_right">
              <span class="delivery_style delivery_left" v-if="item.delivery_mode">{{ item.delivery_mode.text }}</span>
              <span class="delivery_style delivery_right" v-if="zhunshi(item.supports)">准时达</span>
            </section>
          </h5>
          <h5 class="fee_distance">
            <p class="fee">
              ￥{{ item.float_minimum_order_amount }}起送
              <span class="segmentation">/</span>
              {{ item.piecewise_agent_fee.tips }}
            </p>
            <p class="distance_time">
              <span v-if="Number(item.distance)">
                {{item.distance > 1000? (item.distance/1000).toFixed(2) + 'km': item.distance + 'm'}}
                <span class="segmentation">/</span>
              </span>
              <span v-else>{{ item.distance }}</span>
              <span class="segmentation">/</span>
              <span class="order_time">{{ item.order_lead_time }}</span>
            </p>
          </h5>
        </hgroup>
      </router-link>
    </ul>
    <ul v-else class="animation_opacity">
      <li class="list_back_li" v-for="item in 10" :key="item">
        <img src="../../images/shopback.svg" class="list_back_svg">
      </li>
    </ul>
    <p v-if="touchend" class="empty_data">没有更多了</p>
    <aside class="return_top" @click="backTop" v-if="showBackStatus">
      <svg class="back_top_svg">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#backtop"></use>
      </svg>
    </aside>
    <div ref="abc" style="background-color: red;"></div>
    <transition name="loading">
      <loading v-show="showLoading"></loading>
    </transition>
  </div>
</template>

<script>
/* eslint-disable no-useless-return */
import { mapState } from 'vuex'
import { shopList } from '@/service/getData'
import { imgBaseUrl } from '@/config/env'
import { showBack, animate } from '@/config/mUtils'
import { loadMore, getImgPath } from './mixin'
import loading from './loading'
import ratingStar from './ratingStar'
export default {
  data () {
    return {
      offset: 0, // 批次加载店铺列表，每次加载20个 limit = 20
      shopListArr: [], // 店铺列表数据
      preventRepeatReuqest: false, // 到达底部加载数据，防止重复加载
      showBackStatus: false, // 显示返回顶部按钮
      showLoading: true, // 显示加载动画
      touchend: false, // 没有更多数据
      imgBaseUrl
    }
  },
  mounted () {
    this.initData()
  },
  components: {
    loading,
    ratingStar
  },
  props: [
    'restaurantCategroyId',
    'restaurantCategroyIds',
    'sortByType',
    'deliveryMode',
    'supportIds',
    'confirmSelect',
    'geohash'
  ],
  mixins: [loadMore, getImgPath],
  computed: {
    ...mapState([
      'latitiude',
      'longitude'
    ])
  },
  methods: {
    async initData () {
      // 获取数据
      let res = await shopList(this.latitude, this.longitude, this.offset, this.restaurantCategroyId)
      this.shopListArr = [...res]
      // 如果数据小于20个 则说明数据加载完毕
      if (res.length < 20) {
        this.touchend = true
      }
      this.hideLoading()
      showBack(status => {
        this.showBackStatus = status
      })
    },

    async loaderMore () {
      if (this.touchend) {
        return
      }
      if (this.preventRepeatReuqest) {
        return
      }
      this.showLoading = true
      this.preventRepeatReuqest = true

      this.offset += 20
      let res = await shopList(this.latitude, this.longitude, this.offset, this.restaurantCategroyId)
      this.hideLoading()
      this.shopListArr = [...this.shopListArr, ...res]
      // 数据量小于20 则表示没有更多数据
      if (res.length < 20) {
        this.touchend = true
        return
      }

      this.preventRepeatReuqest = false
    },

    backTop () {
      animate(document.body, {scrollTop: '0'}, 400, 'ease-out')
    },

    async listenPropChange () {
      this.showLoading = true
      this.offset = 0
      let res = await shopList(this.latitude, this.longitude, this.offset, '', this.restaurantCategoryIds, this.sortByType, this.deliveryMode, this.supportIds)
      this.hideLoading()
      this.shopListArr = [...res]
    },

    hideLoading () {
      this.showLoading = false
    },
    zhunshi (supports) {
      let zhunStatus
      if ((supports instanceof Array) && supports.length) {
        supports.forEach(item => {
          if (item.icon_name === '准') {
            zhunStatus = true
          }
        })
      } else {
        zhunStatus = false
      }
      return zhunStatus
    }
  },
  watch: {
    restaurantCategroyIds: function (value) {
      this.listenPropChange()
    },

    sortByType: function (value) {
      this.listenPropChange()
    },

    confirmSelect: function (value) {
      this.listenPropChange()
    }
  }
}
</script>
