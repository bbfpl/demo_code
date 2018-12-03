// 微信支付方法（点击按键调用）
let wx = require('weixin-js-sdk')
/*
微信支付方法
获取微信加签信息
@param{data}:获取的微信加签
@param{cb}:成功回调
*/
let wexinPay = (configData, payData, cb, cancelCb, errorCb) => {
  wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: configData.appId, // 必填，公众号的唯一标识
    timestamp: configData.timestamp, // 必填，生成签名的时间戳
    nonceStr: configData.nonceStr, // 必填，生成签名的随机串
    signature: configData.signature, // 必填，签名，见附录1
    jsApiList: configData.jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
  })
  wx.ready(function () {
    wx.chooseWXPay({
      appId: payData.appId,
      timeStamp: payData.timestamp,
      nonceStr: payData.nonceStr,
      package: payData.package,
      signType: 'MD5',
      paySign: payData.paySign,
      success: function (res) {
        // 支付成功后的回调函数
        cb(res)
      },
      cancel: function () {
        cancelCb()
      },
      fail: function (res) {
        errorCb(res)
      }
    })
  })
  wx.error(function (res) {
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    /* alert("config信息验证失败"); */
    alert(JSON.stringify(res))
  })
}
export default wexinPay