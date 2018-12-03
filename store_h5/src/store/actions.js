import http from '../utils/http'
import api from '../config/api'
import Interceptor from '../utils/interceptor'
import Store from './index'

export default {
  signOut({commit}) {
    commit('resetUserInformation')
    commit('clearToken')
  },
  sendSafeCode({dispatch}, phone) {
    let params = {
      'phone': phone,
      'phone_country_code': Store.state.phoneCountryCode
    }
    return new Promise(function (resolve, reject) {
      http.post(api.APIS.postSafeCode, params, {headers: Interceptor.httpConfig()}).then((res) => {
        if (!res.data.meta.msg) { // 无错误信息
          resolve(res)
        } else {
          let errorNotice = res.data.meta.msg[Store.state.currentLang]
          dispatch('pushNotification', {notice: errorNotice})
          reject(errorNotice)
        }
      }, (error) => {
        // 请求失败 (已在main.js中统一提示)
        let errorNotice = error.response.data.meta.msg[Store.state.currentLang]
        reject(errorNotice)
      })
    })
  }
}
