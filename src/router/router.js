import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const home = r => require.ensure([], () => r(require('@/page/home/home')), 'home')

export const constantRouteMap = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: home
  }
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
