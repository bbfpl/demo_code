let App = getApp()
let Http = require('/http.js')
let Api = require('../config/api.js')
let auth = require('/auth.js')
import util from '/util.js'
import appStorage from '/appStorage.js'

function autoLogin() {
  let p = getParams().then((res) => {
    return apiLogin(res)
  }).then((apiLoginRes) => {
    return getUserByApi()
  }).then((userInfo) => {
    return userInfo
  })

  return Promise.resolve(p)
}

function getParams() {
  const wxLogin = util.promiseFun(wx.login)
  const wxGetUserInfo = util.promiseFun(wx.getUserInfo)

  let p = Promise.all([wxLogin, wxGetUserInfo]).then(([loginRes, userInfo]) => {
    let params = {
      'grant_type': 'code',
      'platform': 'mp',
      'code': loginRes.code,
      'encrypted_data': userInfo.encryptedData,
      'raw_data': userInfo.rawData,
      'signature': userInfo.signature,
      'iv': userInfo.iv
    }
    return Promise.resolve(params)
  }, (error) => {
    wx.redirectTo({
      url: '/pages/login/login',
    })
    return Promise.reject('Not userInfo Authed')
  })

  return p
}

function apiLogin(params) {
  let status = 'resolve'
  let p = Http.post(Api.postAuth, params).then((response) => {
    let res = response.data.data
    console.log('login api res', res)

    if (res.access_token) {
      // 已注册用户
      wx.setStorageSync('TOKEN', res.access_token)
      appStorage.setExpireIn('TOKEN', res.expire_in * 1000)
      return Promise.resolve(res)
    } else {
      // 新用户
      wx.setStorageSync('oauthFlag', res.flag)
      wx.reLaunch({
        url: '/pages/bindPhone/bindPhone'
      })
    }

  }).catch(function(error) {
    console.log('Login error', error)
    return Promise.reject(error)
  })

  return p
}

function getUserByApi() {
  let p = Http.get(Api.getUser, true).then((res) => {
    return Promise.resolve(res)
  }, (error) => {
    return Promise.reject(error)
  })
  return p
}

module.exports = autoLogin
