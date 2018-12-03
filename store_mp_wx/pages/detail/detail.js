// pages/detail/detail.js
const Api = require('../../config/api.js');
const Http = require('../../utils/http.js');
const WxParse = require("../../lib/wxParse/wxParse.js");
//获取应用实例
const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否采用衔接滑动
    circular: true,
    //是否显示画板指示点
    indicatorDots: true,
    //选中点的颜色
    indicatorcolor: "#000",
    //是否竖直
    vertical: false,
    //是否自动切换
    autoplay: true,
    //滑动动画时长毫秒
    duration: 300,
    //所有图片的高度
    imgheights: [],
    //图片宽度
    imgwidth: 750,
    //默认
    current: 0,

    uuid: null,
    item: {},
    bannerImages: [],
    shareTitle:'熊猫大陆'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uuid: options.uuid
    });
    this.getProduct();
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
    App.globalData.selectAddress = {};
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
  getProduct: function () {
    wx.showLoading();
    let that = this;
    let api = Api.getProductInfo.replace('$uuid', this.data.uuid)
    Http.get(api).then(data => {
      let _data = data.data.data;

      that.setData({
        item: _data || {},
        bannerImages: _data.images || [],
        shareTitle: _data.title
      });
      wx.setNavigationBarTitle({
        title: _data.title
      });
      let article = _data.content;
      WxParse.wxParse('article', 'html', article , that, 0);
      wx.hideLoading()
    })
  },
  imageLoad: function (e) {
    let res = wx.getSystemInfoSync();
    let imgwidth = e.detail.width,
      imgheight = e.detail.height,
      ratio = imgwidth / imgheight;
    this.setData({
      bannerHeight: res.windowWidth / ratio
    })
  },
  buy: function (event){
    let uuid = event.currentTarget.dataset.id;

    let userInfo = App.globalData.userInfo;
    const TOKEN = wx.getStorageSync('TOKEN') || '';

    if (userInfo == null || TOKEN == ''){
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }else{
      wx.navigateTo({
        url: '/pages/buy/buy?uuid=' + uuid
      })
    }
  }
})