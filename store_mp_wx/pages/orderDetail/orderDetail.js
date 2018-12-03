// pages/orderDetail/orderDetail.js
const Api = require('../../config/api.js');
const Http = require('../../utils/http.js');
const Util = require('../../utils/util.js');
const PayStart = require('../../utils/payStart.js');
const OrderStatus = require('../../utils/orderStatus.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo: null,
    isPayLoading: false,
    item: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      orderNo: options.order_no
    });
    this.getUserOrderInfo();
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  getUserOrderInfo() {
    wx.showLoading()

    let that = this;
    let api = Api.getUserOrderInfo.replace('$orderNo', this.data.orderNo)

    Http.get(api, {}, true).then(data => {
      let _data = data.data.data;
      _data.time = Util.time(_data.created_at);
      this.setData({
        item: _data,
        getStatusInfo: OrderStatus.getStatus(_data)
      });
      wx.hideLoading()
    })
  },
  pay() {
    let that = this;
    let order_no = this.data.orderNo;
    that.setData({
      isPayLoading: true
    });
    PayStart.init(function() {
      let api = Api.postOrdersPay.replace('$orderNo', order_no);
      Http.post(api, {
        'payment_type': 'wxpay'
      }, true).then(data => {
        let _data = data.data.data;
        wx.requestPayment({
          'timeStamp': _data.timestamp,
          'nonceStr': _data.nonceStr,
          'package': _data.package,
          'signType': 'MD5',
          'paySign': _data.paySign,
          'success': function(res) {
            console.log(res);
            that.setData({
              isPayLoading: false
            });
            if (res.errMsg == 'requestPayment:ok') {
              setTimeout(function() {
                wx.reLaunch({
                  url: '/pages/payStatus/payStatus?type=success&order_no=' + order_no
                })
              }, 200);
            } else {
              setTimeout(function() {
                wx.reLaunch({
                  url: '/pages/payStatus/payStatus?type=error&order_no=' + order_no
                })
              }, 200);
            }

          },
          'fail': function(res) {
            wx.showToast({
              title: '取消支付',
              icon: 'none'
            });
            that.setData({
              isPayLoading: false
            });
          }
        })
      })
    });

  }
})