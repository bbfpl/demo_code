const App = getApp()
import Notification from "../../utils/notification"
import appStorage from '../../utils/appStorage.js'
let Http = require('../../utils/http.js')
let Api = require('../../config/api.js')

Page({
  data: {
    // 输入框参数设置
    inputData: {
      input_value: "", //输入框的初始内容
      value_length: 0, //输入框密码位数
      isNext: false, //是否有下一步的按钮
      get_focus: true, //输入框的聚焦状态
      focus_class: true, //启用输入框聚焦样式
      value_num: [1, 2, 3, 4], //输入框格子数
      height: "140rpx", //输入框高度
      width: "100%", //输入框宽度
      interval: true //格子之间有间距
    },
    phone: '',
    phoneCountryCode: '',
    redirectUrl: '',
    notificationArr: [],
    countdown: 0
  },

  onLoad: function(options) {
    let redirectUrl = '/pages/index/index'
    if (wx.getStorageSync('redirectUrl')) {
      redirectUrl = wx.getStorageSync('redirectUrl')
    }
    this.setData({
      phone: options.phoneNumber,
      phoneCountryCode: App.globalData.phoneCountryCode,
      redirectUrl: redirectUrl
    })
  },

  // 当组件输入数字4位数时的自定义函数
  signIn(e) {
    let that = this
    let safeCode = e.detail
    let params = {
      grant_type: 'phone',
      grant_method: 'code',
      platform: 'mp',
      phone_country_code: that.data.phoneCountryCode,
      phone: that.data.phone,
      safe_code: safeCode,
      oauth_flag: wx.getStorageSync('oauthFlag')
    }
    Http.post(Api.postSignIn, params).then((res) => {
      if (res.data.data.access_token) {
        wx.setStorageSync('TOKEN', res.data.data.access_token)
        appStorage.setExpireIn('TOKEN', res.data.data.expire_in * 1000)
        wx.removeStorage({key: 'redirectUrl'})
        wx.removeStorage({key: 'oauthFlag'})

        wx.switchTab({
          url: that.data.redirectUrl
        })
      } else {
        Notification.push(that, {
          val: res
        })
      }

    })
  },

  sendSafeCodeAgain() {
    this.setData({
      countdown : 60
    })
    this.runTimer()
    const params = {
      'phone': this.data.phone,
      'phone_country_code': this.data.phoneCountryCode
    }
    Http.post(Api.postSafeCode, params).then((res) => {
    }, (error) => {
      Notification.push(this, {
        val: error.data.meta.msg.cn
      })
    })
  },

  runTimer() {
    if (this.data.countdown > 0) {
      this.setData({
        countdown : this.data.countdown - 1
      })
      setTimeout(this.runTimer, 1000)
    }
  }

})