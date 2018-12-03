import Api from '@/config/api'
import Http from '@/utils/http'
import Interceptor from '@/utils/interceptor'

let app = {
  getRoute: null,
  init(obj, callback, errorCallback) {
    this.obj = obj

    this.getRoute = this.obj.route

    let code = this.getRoute.query.code

    if (code) {
      this.postOpenId(code, callback)

      // 删除
      let url = window.location.href
      let valiable = url.split('?')[0]
      window.history.pushState({}, 0, valiable)
    } else {
      // 先判断是否可以支付了
      this.hasOpenId(callback, errorCallback)
    }
  },
  hasOpenId(callback, errorCallback) {
    let that = app
    Http.get(Api.APIS.getOpenid + '?app_id=wx14c0f0c0864d30d0', Interceptor.httpConfig(true)).then(data => {
      let _data = data.data.data
      if (_data !== null && _data.has_open_id) {
        callback()
      } else {
        that.getWxCode()
      }
    }).catch(function (error) {
      if (errorCallback) {
        errorCallback(error)
      }
    })
  },
  postOpenId(code, callback) {
    let that = app
    Http.post(Api.APIS.postOpenid, {
      code: code,
      app_id: 'wx14c0f0c0864d30d0'
    }, {
      headers: Interceptor.httpConfig(true)
    }).then(data => {
      let _data = data.data.data
      if (_data !== null && _data.has_open_id === true && _data.has_open_id !== undefined) {
        callback()
      } else {
        // 重新获取code
        that.getWxCode()
      }
    }).catch(function (error) {
      that.getWxCode()
    })
  },
  // get has_open_id 为false 去获取code
  getWxCode() {
    // 重新获取code的时候都会重新拼url 去掉之前有code
    let redirectRri = encodeURIComponent(window.location.origin + this.getRoute.path)
    let authorizeUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx14c0f0c0864d30d0&redirect_uri=' + redirectRri + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'

    window.location.href = authorizeUrl
  }
}

export default app