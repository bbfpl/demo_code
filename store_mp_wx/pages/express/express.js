// pages/express/express.js
const Api = require('../../config/api.js');
const Http = require('../../utils/http.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo:null,
    logistics:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderNo: options.order_no
    });
    this.getUserOrderLogistics();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 获取物流信息
  getUserOrderLogistics: function () {
    let that = this
    let api = Api.getUserOrderLogistics.replace('$orderNo', that.data.orderNo)
    Http.get(api,{},true).then(data => {
      let _data = data.data.data
      if (_data.detail.length > 0) {
        _data.detail.forEach(function (v) {
          v.time = that.time(v.created_at)
        })
      }
      this.setData({
        logistics: _data
      });
    })
  },
  time: function (value) {
    let time = new Date(value)
    let m = time.getMonth() + 1
    let d = time.getDate()
    let h = time.getHours()
    let mm = time.getMinutes()
    return {
      t1: m + '-' + d,
      t2: h + ':' + mm
    }
  }
})