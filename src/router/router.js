import Vue from 'vue'
import Router from 'vue-router'

import App from '../App'

Vue.use(Router)

const home = r => require.ensure([], () => r(require('@/page/home/home')), 'home')
const city = r => require.ensure([], () => r(require('@/page/city/city')), 'city')
const msite = r => require.ensure([], () => r(require('@/page/msite/msite')), 'msite')
const search = r => require.ensure([], () => r(require('@/page/search/search')), 'search')
const order = r => require.ensure([], () => r(require('@/page/order/order')), 'order')
const profile = r => require.ensure([], () => r(require('@/page/profile/profile')), 'profile')
const login = r => require.ensure([], () => r(require('@/page/login/login')), 'login')
const errorPage = r => require.ensure([], () => r(require('@/page/404')), 'errorPage')
const info = r => require.ensure([], () => r(require('@/page/profile/children/info')), 'info')

export const constantRouteMap = [
  {
    path: '/',
    component: App,
    children: [
      {
        path: '',
        redirect: '/home'
      },
      {
        path: '/home',
        component: home
      },
      {
        path: 'city/:cityid',
        component: city
      },
      {
        path: '/msite',
        component: msite,
        meta: {keepAlive: true}
      },
      {
        path: '/order',
        component: order
      },
      {
        path: '/profile',
        component: profile,
        children: [{
          path: 'info',
          component: info
        }]
      },
      {
        path: '/search/:geohash',
        component: search
      },
      {
        path: '/login',
        component: login
      },
      {
        path: '/404',
        component: errorPage
      }
    ]
  },
  {path: '*', redirect: '/404'}
]

export default new Router({
  routes: constantRouteMap,
  mode: 'hash',
  strict: process.env.NODE_ENV !== 'production',
  scrollBehavior (to, from, savedPostion) {
    if (savedPostion) {
      return savedPostion
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPostion = document.body.scrollTop
      }
      return { x: 0, y: to.meta.savedPostion || 0 }
    }
  }
})
