let App = getApp()
let Http = require('../../utils/http.js')
let Api = require('../../config/api.js')
import Notification from '../../utils/notification.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    notificationArr: [],
    avatarPath: '',
    changeSuccess: ''
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    App.getUser().then((res) => {
      this.setData({
        avatarPath: res.avatar
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  submitHandler: function() {
    let images = this.data.uploader.images.map((e, i) => {
      return e.image
    })
  },

  uploadImgsEnd(data) {
    if (data.detail.currentType === 'success') {
      this.changeAvatar(data.detail.res[0])
    }
  },

  changeAvatar(res) {
    let index = res.imagesInfo.image.indexOf('temp')
    let imagesSrc = res.imagesInfo.image.substring(index)
    let params = {
      path: imagesSrc
    }

    Http.put(Api.putUserAvatar, params, true).then((res) => {
      
      Notification.push(this, {
        val: '修改头像成功',
        currentType: 'notice'
      })
      this.setData({
        avatarPath: res.data.data.avatar,
        changeSuccess: 'success'
      })
      App.globalData.userInfo = res.data.data
      setTimeout(function() {
        wx.navigateTo({
          url: '/pages/account/account',
        })
      }, 2000)

    }, (error) => {
      
      this.setData({
        changeSuccess: 'fail'
      })
      Notification.push(this, {
        val: error.data.meta.msg.cn
      })

      wx.hideLoading()
    })
  }
})