// axios 的请求拦截器
// 注意 axios 请求必须小写 like: post get
// "Accept", "Content-Type", "QSC-Token", "Authorization", "DeviceId", "Platform", "QSC-Language"
import axios from 'axios'
// import passport from '@/utils/passport'
import webStorage from './webStorage'

export default {
  setConf: (param) => {
    axios.interceptors.request.use(function(config) {
      for (let i in param) {
        config.headers[i] = param[i]
      }
      return config
    }, function(err) {
      return Promise.reject(err)
    })
  },
  httpConfig: (checkAuth = false) => {
    let headers = {
      'Accept': 'application/json',
      'Platform': 'store/oa/1.0.0',
      'Content-Type': 'application/json; charset=utf-8'
    }
    if (checkAuth) {
      let token = webStorage.getUnExpiredVal('token')
      headers['Authorization'] = token || ''
    }
    return headers
  }
}