let App = getApp()
let Http = require('../../utils/http.js')
let Api = require('../../config/api.js')
import Notification from '../../utils/notification.js'
const {
  watch,
  computed
} = require('../../utils/vuefy.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: '',
    phoneCountryCode: '',
    loading: false,
    phoneNumber: '',
    notificationArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    computed(this, {
      disabledSubmit: function() {
        return this.data.loading || !this.data.phoneNumber
      }
    })

    this.setData({
      'user': App.globalData.userInfo,
      'phoneCountryCode': App.globalData.phoneCountryCode
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  resetNotificationArr() {},

  inputVal(e) {
    let changeKey = e.target.dataset.key
    this.setData({
      [changeKey]: e.detail.value
    })
  },

  validateForm() {
    if (this.data.loading) {
      return
    }
    this.setData({
      loading: true
    })
    this.sendCode()
  },

  sendCode() {
    const params = {
      'phone': this.data.phoneNumber,
      'phone_country_code': this.data.phoneCountryCode
    }
    Http.post(Api.postSafeCode, params).then((res) => {
      this.setData({
        loading: false
      })

      wx.navigateTo({
        url: `/pages/enterSafeCode/enterSafeCode?phoneNumber=${this.data.phoneNumber}`
      })
    }, (error) => {
      Notification.push(this, {
        val: error.data.meta.msg.cn
      })
      this.setData({
        loading: false
      })
    })
  }
})