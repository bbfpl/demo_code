let Http = require('../../utils/http.js')
let Api = require('../../config/api.js')
import Notification from '../../utils/notification.js'
// import { getArrItemByKey } from '../../utils/arrHandler'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notificationArr: [],
    orderid:null,
    type: {
      edit: true,
      select: false
    },
    addAddressPath: '/pages/addAddress/addAddress',
    receiptInfoArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '',
    })
    // 从订单页跳转到地址列表
    let _orderid = options.order
    if (_orderid) {
      this.setData({
        orderid: _orderid,
        type: {
          edit: false,
          select: true
        },
        addAddressPath: `/pages/addAddress/addAddress?order=${_orderid}`
      })
    }
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
    this.getAddresses()
  },



  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  getAddresses() {
    Http.get(Api.getAddresses).then((res) => {
      // let defaultAddressObj = getArrItemByKey(res.data.data, 'is_default', true)
      wx.hideLoading()
      this.setData({
        receiptInfoArr: res.data.data
      })
    }, (error) => {
      wx.hideLoading()
      Notification.push(this, {
        val: error.data.meta.msg.cn
      })
    })
  },

  clickHandler(e) {
    let info = e.currentTarget.dataset.info
    console.log('info', info)
    if (this.data.type.edit) {
      this.setEditAddressInfo(info)
    } else {
      this.openAddress(info)
    }
  },

  setEditAddressInfo(addressObj) {
    wx.setStorageSync('edit_address_info', addressObj)
    wx.navigateTo({
      url: `/pages/editAddress/editAddress?id=${addressObj.id}`
    })
  },

  openAddress(info) {
    // 选择地址并且返回
    app.globalData.selectAddress = info;
    // wx.navigateTo({
    //   url: '/pages/buy/buy?uuid=' + this.data.orderid
    // })
    wx.navigateBack({ changed: true });
  },

  addAddress() {
    wx.navigateTo({
      url: this.data.addAddressPath
    })
  }
})