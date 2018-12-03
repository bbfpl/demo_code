const Api = require('../../config/api.js')
const Http = require('../../utils/http.js')
const Util = require('../../utils/util.js')
const OrderStatus = require('../../utils/orderStatus.js')

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    systemInfo: {},
    type: null,
    userInfo: {},
    navbar: ['资产', '订单', '消息'],
    currentNavbar: '0',
    //资产
    assetsList: [],
    assetsPage: 1,
    assetsNoData: false,
    //订单
    orderList: [],
    orderPage: 1,
    orderNoData: false,
    //消息
    messageList: [],
    messagePage: 1,
    messageNoData: false,
    //更多 是否可以滚动
    isScroll: true,
    isNew: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this

    app.getSystemInfo(function(res) {
      that.setData({
        systemInfo: res,
        type: options.type || null
      })
    })

    that.getNewMessage()

    if (that.data.type == null) {
      that.getAssets()
    } else {
      if (that.data.type == 'order') {
        that.getUserOrders()
        that.setData({
          currentNavbar: 1
        })
      }
    }

    if (options.oid) {
      wx.navigateTo({
        url: '/pages/orderDetail/orderDetail?order_no=' + options.oid
      })
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    app.getUser().then((res) => {
      this.setData({
        userInfo: res
      })
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

    if (this.data.currentNavbar == 0 && this.data.isScroll == true) {
      this.pullUpLoadAssets()
    }
    if (this.data.currentNavbar == 1 && this.data.isScroll == true) {
      this.pullUpLoadOrder()
    }
    if (this.data.currentNavbar == 2 && this.data.isScroll == true) {
      this.pullUpLoadMessage()
    }

  },
  
  onPageScroll: function(e) {
    // let scrollTop = e.scrollTop
    // let innerHeight = this.data.systemInfo.windowHeight
    // let scrollH = this.data.systemInfo.screenHeight
    // console.log(scrollTop + ':' + innerHeight + ':' + scrollH)
  },

  /**
   * 切换 navbar
   */
  swichNav(e) {

    this.setData({
      currentNavbar: e.currentTarget.dataset.idx,
      //重置
      isScroll: true,
      //资产
      assetsList: [],
      assetsPage: 0,
      assetsNoData: false,
      //订单
      orderList: [],
      orderPage: 0,
      orderNoData: false,
      //消息
      messageList: [],
      messagePage: 0,
      messageNoData: false
    })

    this.onReachBottom()
  },

  getNewMessage() {
    let that = this
    Http.get(Api.getUserMessages, {}, true).then((res) => {
      let data = res.data.data
      let id = 0
      if (data.length > 0) {
        id = data[0]['id']
      }

      let _smid = wx.getStorageSync('msg_max_id')

      // wx.setStorageSync('msg_isNew', (id > _smid))
      that.setData({
        isNew: (id > _smid)
      })
    })
  },
  /**
   * 获取资产数据
   */
  getAssets() {
    console.log('getAssets')
    wx.showLoading()
    let that = this
    Http.get(Api.getUserAssets, {
      size: 10,
      page: that.data.assetsPage
    }, true).then(data => {
      let _data = data.data.data

      if (_data.length !== 0) {
        _data.forEach(function(v) {
          v.time = Util.time(v.created_at)
          v.stateName = v.state === 'None' ? '未上链' : '已上链'
        })
      } else {
        that.setData({
          assetsNoData: true
        })
      }
      // 如果数据小于10条没有更多数据
      if (_data.length < 11) {
        that.setData({
          isScroll: false
        })
      }
      let list = that.data.assetsList.concat(_data.slice(0, 10))

      that.setData({
        assetsList: list || []
      })
      wx.hideLoading()
    })
  },
  /**
   * 资产数据加载更多
   */
  pullUpLoadAssets() {
    let page = this.data.assetsPage + 1
    this.setData({
      assetsPage: page
    })
    this.getAssets()
  },
  /**
   * 获取订单数据
   */
  getUserOrders() {
    console.log('getOrder')
    wx.showLoading()
    let that = this
    Http.get(Api.getUserOrders, {
      size: 10,
      page: that.data.orderPage
    }, true).then(data => {
      let _data = data.data.data

      if (_data.length !== 0) {
        _data.forEach(function(v) {
          v.time = Util.time(v.created_at)
          v.status = OrderStatus.getStatus(v)
        })
      } else {
        that.setData({
          orderNoData: true
        })
      }
      // 如果数据小于10条没有更多数据
      if (_data.length < 11) {
        that.setData({
          isScroll: false
        })
      }
      let list = that.data.orderList.concat(_data.slice(0, 10))

      that.setData({
        orderList: list || []
      })
      wx.hideLoading()
    })
  },
  /**
   * 订单数据加载更多
   */
  pullUpLoadOrder() {
    let page = this.data.orderPage + 1
    this.setData({
      orderPage: page
    })
    this.getUserOrders()
  },
  /**
   * 获取消息数据
   */
  getUserMessage() {
    console.log('getUserMessage')
    wx.showLoading()
    let that = this
    Http.get(Api.getUserMessages, {
      size: 10,
      page: that.data.messagePage
    }, true).then(data => {
      let _data = data.data.data

      if (_data.length > 0) {
        let maxid = _data[0]['id']

        wx.setStorageSync('msg_max_id', maxid)

        let _smid = wx.getStorageSync('msg_max_id')
        that.setData({
          isNew: (maxid > _smid)
        })
        _data.forEach(function(v) {
          v.time = Util.time(v.created_at)
        })
      }
      if (_data.length <= 0) {
        that.setData({
          messageNoData: true
        })
      }
      // 如果数据小于10条没有更多数据
      if (_data.length < 11) {
        that.setData({
          isScroll: false
        })
      }
      let list = that.data.messageList.concat(_data.slice(0, 10))

      that.setData({
        messageList: list || []
      })
      wx.hideLoading()
    })
  },
  /**
   * 消息数据加载更多
   */
  pullUpLoadMessage() {
    let page = this.data.messagePage + 1
    this.setData({
      messagePage: page
    })
    this.getUserMessage()
  },
  /*打开订单详情*/
  openOrderDetail(event) {
    let order_no = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?order_no=' + order_no
    })

  }

})