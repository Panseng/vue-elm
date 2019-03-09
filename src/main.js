// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/router'
import store from './store'
import './config/rem'
import FastClick from 'fastclick'

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function () {
    // 移动端触摸、点击事件优化
    FastClick.attach(document.body)
  }, false)
}

Vue.config.productionTip = false

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
