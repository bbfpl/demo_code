const Http = require('../../utils/http.js');
const Api = require('../../config/api.js');

//获取应用实例
const app = getApp()

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
      title: this.data.shareTitle,
      path: 'pages/explore/explore',
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
    wx.setNavigationBarTitle({
      title: '探索'
    });
    wx.showLoading();
    this.getExploreInfo();
  },
  getExploreInfo: function () {
    let that = this;
    Http.get(Api.getExplore).then(data => {
      let _data = data.data.data;
      that.setData({
        images: _data || []
      });
      wx.hideLoading()
    })
  },
  openDetail(e) {
    let _link = e.target.dataset.link;
    let uuid = _link.substring(_link.lastIndexOf("\/") + 1, _link.length);
    wx.navigateTo({
      url: '/pages/detail/detail?uuid=' + uuid
    })
  }
})