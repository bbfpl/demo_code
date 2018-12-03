// import wx from 'weixin-js-sdk'

let isWeChatReady = false
// 检查微信wx.ready
export default class AlWeChat {
  constructor(object, shareConfig = {}) {
    this.object = object // vue 需要使用vue 解决回调
    this.wxConfig(shareConfig) // 初始微信配置
  }
  /** * 微信配置 **/
  wxConfig(shareConfig) {
    let self = this
    self.object.$store.dispatch('getJsSdk').then((configData) => {
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: configData.appId, // 必填，公众号的唯一标识
        timestamp: configData.timestamp, // 必填，生成签名的时间戳
        nonceStr: configData.nonceStr, // 必填，生成签名的随机串
        signature: configData.signature, // 必填，签名，见附录1
        jsApiList: configData.jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      })
      wx.ready(function() {
        isWeChatReady = true
        setTimeout(function() {
          self.wxQDetailShare(shareConfig) // 分享到朋友圈+朋友的设置
        }, 100)
      })
      wx.error(function(res) {
        console.log(JSON.stringify(res));
      })
    })
  }
  /** * 微信扫一扫 * */
  wxScanQRCode(fn) {
    wx.scanQRCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ['qrCode'], // 可以指定扫二维码还是一维码，默认二者都有
      success: function(res) {
        var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
        fn(result)
      }
    })
  }
  /** * 分享到朋友圈+朋友的设置 * 可以动态设置 * */
  wxQDetailShare(data) {
    var config = {
      title: data.title || 'pandaearth',
      desc: data.desc || 'pandaearth',
      imgUrl: data.imgUrl || '',
      link: data.link || ''
    }
    var shareConfig = {
      message: config,
      timeLine: {
        title: config.title,
        desc: config.desc,
        imgUrl: config.imgUrl,
        link: config.link
      }
    }
    console.log(shareConfig)
    this.wxShare(shareConfig)
  } /** * 分享的基本配置 * @Author Hybrid * @DateTime 2017-11-21 * @param {} shareConfig [不同类型的分享有不同的配置] * @return {[type]} [description] */
  wxShare(shareConfig) {
    let self = this

    if (isWeChatReady) { /** * 分享到朋友圈 * @Author Hybrid */
      wx.onMenuShareTimeline({
        title: shareConfig.timeLine.title, // 分享标题
        link: shareConfig.timeLine.link, // 分享链接
        imgUrl: shareConfig.timeLine.imgUrl, // 分享图标
        success: function() {
          // alert('分享到朋友圈Success')
          // self.object.closecovershow() // 回调
          // 用户确认分享后执行的回调函数
        },
        cancel: function() {
          // alert('分享到朋友圈 用户取消')
          // self.object.closecovershow() // 用户取消分享后执行的回调函数
        }
      }) /** * 分享给朋友 * @Author Hybrid */
      wx.onMenuShareAppMessage({
        title: shareConfig.message.title, // 分享标题
        desc: shareConfig.message.desc, // 分享描述
        link: shareConfig.message.link, // 分享链接
        imgUrl: shareConfig.message.imgUrl, // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function() {
          // alert('分享给朋友 Success')
          // self.object.closecovershow() // 用户确认分享后执行的回调函数
        },
        cancel: function() {
          // alert('分享给朋友 用户取消')
          // self.object.closecovershow() // 用户取消分享后执行的回调函数
        }
      })
    }
  } /** * 微信支付 * */
  payWeChat(data, redirectUrl, callback) {
    let self = this
    WeixinJSBridge.invoke('getBrandWCPayRequest', {
      'appId': data.appId,
      'timeStamp': data.timestamp, // 大写S
      'nonceStr': data.nonceStr, // 大写S
      'package': data.package,
      'signType': 'MD5',
      'paySign': data.paySign
    }, function(res) {
      // else if (res.err_msg == "get_brand_wcpay_request:cancel") {

      // }
      if (res.err_msg == 'get_brand_wcpay_request:ok') {
        self.object.$router.push({
          path: redirectUrl.success
        })
      } else {
        self.object.$router.push({
          path: redirectUrl.fail
        })
      }
      // 不管支付成功还是失败 先重置选择的地址
      self.object.$store.commit('RESET_ADDRESS_INFO')
      // callback
      if (callback) {
        callback()
      }
      // alert("支付:" + JSON.stringify(res));
      // callback(res);
    })
  }
}