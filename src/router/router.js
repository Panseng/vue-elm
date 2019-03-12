import Vue from 'vue'
import Router from 'vue-router'

import App from '../App'

Vue.use(Router)

const home = r => require.ensure([], () => r(require('@/page/home/home')), 'home')
const city = r => require.ensure([], () => r(require('@/page/city/city')), 'city')
const msite = r => require.ensure([], () => r(require('@/page/msite/msite')), 'msite')

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
      }
    ]
  },
  {path: '*', redirect: '/'}
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
