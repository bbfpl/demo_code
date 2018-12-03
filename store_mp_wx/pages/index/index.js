const Api = require('../../config/api.js');
const Http = require('../../utils/http.js');


//获取应用实例
const App = getApp()

Page({
  data: {
    images: []
  },
  //事件处理函数
  bindViewTap: function () {

  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '熊猫大陆',
      path: 'pages/index/index',
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
  onLoad: function () {

    this.getHomeInfo();

    // wx.navigateTo({
    //   url: '/pages/buy/buy?uuid=2eb5566f-c403-473f-92a3-bf752089c0d1'
    // })
    // wx.navigateTo({
    //   url: '/pages/addAddress/addAddress'
    // })
    
    // wx.navigateTo({
    //   url: '/pages/express/express?order_no=201809181359304842740004'
    // })

    // wx.navigateTo({
    //   url: '/pages/payStatus/payStatus?type=success&order_no=201810121359304832580004'
    // })
    
    // wx.navigateTo({
    //   url: '/pages/login/login'
    // })

    // wx.reLaunch({
    //   url: '/pages/user/user?type=order&oid=201809281359304843360140'
    // })


    // wx.reLaunch({
    //   url: '/pages/orderDetail/orderDetail?order_no=201809281359304843160140'
    // })
    // console.log();
    
    
  },
  getHomeInfo: function () {
    wx.showLoading();
    let that = this;
    Http.get(Api.getHome).then(data => {
      let _data = data.data.data;
      that.setData({
        images: _data || []
      });
      wx.hideLoading()
    })
  }
})