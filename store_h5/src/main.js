// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueI18n from 'vue-i18n'
import localesZh from './common/lang/zh.js'
import localesEn from './common/lang/en.js'
import pageTitle from './common/pageTitle'
import filter from './common/filter'
import store from './store/index'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate'
import appValidateRules from './utils/appValidaterules'
import webStorage from './utils/webStorage'

import App from './App'
import router from './router'

// import vconsole
import VConsole from 'vconsole/dist/vconsole.min.js'

if (process.env.NODE_ENV === 'development') {
  let vConsole = new VConsole() // 初始化
}
// api
// import api from '@/config/api'

// utils
// import store from '@/utils/store'
// import http from '@/utils/http'
import utils from '@/utils/utils'
import passport from '@/utils/passport'
import interceptor from '@/utils/interceptor'

// css
import 'swiper/dist/css/swiper.css'

import './style/ui.less'
import './style/h5.less'
import {
  isWeChat
} from './utils/getBrowerName'

Vue.use(VueI18n)
Vue.use(Vuex)
Vue.use(VeeValidate, {
  locale: '',
  dictionary: appValidateRules
})

let _locale = 'cn'
const i18n = new VueI18n({
  locale: _locale,
  messages: {
    'cn': localesZh, // 中文语言包
    'en': localesEn // 英文语言包
  },
  // 如果语言不存在默认使用 cn
  fallbackLocale: 'cn'
})

Vue.config.productionTip = false

// axios 的返回拦截器
axios.interceptors.response.use(function (response) {
  // 先处理物理层错误
  if (response.status !== 200) {
  } else {
    return response
  }
}, function (error) {
  store.dispatch('pushNotification', {notice: error.response.data.meta.msg.cn, type: 'error'})

  if (error.response.status === 401) {
    if (isWeChat()) {
      window.open('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx14c0f0c0864d30d0&redirect_uri=https://m-qa.pandaearth.store/login&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect')
    } else {
      store.dispatch('signOut')
      window.location.replace('/phone-login')
    }
  }

  return Promise.reject(error)
})

router.beforeEach((to, from, next) => {
  //
  window.scroll(0, 0)

  if (to.meta.auth && !passport.hasAuthToken()) {
    webStorage.set('redirectUrl', to.path)
    next({
      path: '/phone-login'
    })
  }

  try {
    interceptor.resetConfig()
  } catch (e) {
  }

  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = pageTitle[_locale][to.meta.title]
  }

  next()
})

let vm = new Vue({
  el: '#app',
  i18n: i18n,
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})

Vue.use({
  vm
})