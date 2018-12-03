let Http = require('/utils/http.js')
let Api = require('/config/api.js')
let auth = require('/utils/auth.js')
let AutoLogin = require('/utils/signIn.js')

const initUser = {
  nickname: '',
  avatar: '',
  avatar_thumb: '',
  phone: '',
  phone_country_code: '',
  email: null,
  is_set_password: true,
  created_at: '',
  is_bind_oauth: true,
  wallet: ''
}

App({
  globalData: {
    phoneCountryCode: '86',
    userInfo: null,
    selectAddress: {}
  },

  getSystemInfo: function(cb) {
    var that = this
    if (that.globalData.systemInfo) {
      typeof cb == "function" && cb(that.globalData.systemInfo)
    } else {
      wx.getSystemInfo({
        success: function(res) {
          that.globalData.systemInfo = res
          typeof cb == "function" && cb(that.globalData.systemInfo)
        }
      })
    }
  },

  getUser() {
    wx.showLoading({
      title: '',
    })
    if (!!wx.getStorageSync('TOKEN')) {
      // 获取用户信息
      let p = Http.get(Api.getUser, true).then((res) => {
        this.globalData.userInfo = res.data.data
        wx.hideLoading()
        return Promise.resolve(res.data.data)
      }, (error) => {
        wx.hideLoading()
        return Promise.reject(error)
      })
      return p
    } else {
      // 已授权，自动登录并获取用户信息
      let p = auth.checkScope(auth.USER_INFO)
        .then(res => {
          return AutoLogin()
        }).then((resUser) => {
          this.globalData.userInfo = resUser.data.data
          wx.hideLoading()
          return Promise.resolve(resUser.data.data)
        })
      return p
    }
  }
})