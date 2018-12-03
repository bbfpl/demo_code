import * as types from '../mutation-types'
import http from '@/utils/http'
import api from '@/config/api'
import Interceptor from '@/utils/interceptor'
import webStorage from '../../utils/webStorage'
import Store from '../index'

const state = {
  wxUserInfo: {
    nickname: '',
    gender: '',
    country: '',
    province: '',
    city: '',
    avatar: '',
    flag: '',
    open_id: '',
    union_id: null
  },
  userStatus: {
    'is_new': false,
    'is_set_password': false,
    'is_bind_other_oauth': false
  }
}

const mutations = {
  [types.SET_WX_USER_INFO](state, info) {
    Object.assign(state.wxUserInfo, info)
  },
  [types.SET_USER_STATUS](state, status) {
    state.userStatus = status
  }
}

const actions = {
  getWxUserInfo({dispatch, commit}, wxCode) {
    return new Promise(function (resolve, reject) {
      http.post(api.APIS.postAuth, {
        'grant_type': 'code',
        'platform': 'oa',
        'code': wxCode
      }, {
        headers: Interceptor.httpConfig()
      }).then((response) => {
        console.log('response', response)
        let res = response.data.data
        if (response.data.meta.msg) {
          reject(response)
          return
        }
        if (res.access_token) { // 老用户
          webStorage.set('token', res.access_token)
          webStorage.setExpireIn('token', res.expire_in * 1000)
          webStorage.remove('loginInfo')
          commit('updateTokenStatus', true)
        } else { // 新用户
          commit(types.SET_WX_USER_INFO, res)
        }
        setInterval(function () {
          dispatch('refreshToken')
        }, 3600000)
        resolve(res)
      })
    })
  },
  signIn({dispatch, commit}, needOauthFlag = false) {
    let loginInfo = webStorage.get('loginInfo')
    for (let i in loginInfo) {
      if (!loginInfo[i]) {
        delete loginInfo[i]
      }
    }
    if (needOauthFlag) {
      loginInfo.oauth_flag = Store.state.login.wxUserInfo.flag
    }
    return new Promise(function (resolve, reject) {
      http.post(api.APIS.postSignIn, loginInfo, {
        headers: Interceptor.httpConfig()
      }).then((response) => {
        let res = response.data.data
        if (response.data.meta.msg) {
          reject(response)
          return
        }
        if (res.access_token) {
          webStorage.set('token', res.access_token)
          webStorage.setExpireIn('token', res.expire_in * 1000)
          webStorage.remove('loginInfo')
          commit('updateTokenStatus', true)
          resolve(response)
          setInterval(function () {
            dispatch('refreshToken')
          }, 3600000)
        } else {
          reject(response)
        }
      }).catch(function (error) {
        reject(error.response.data)
      })
    })
  },
  refreshToken({dispatch, commit}) {
    return new Promise(function (resolve, reject) {
      http.post(api.APIS.postRefreshToken, {}, {
        headers: Interceptor.httpConfig(true)
      }).then((response) => {
        let res = response.data.data
        if (res.access_token) {
          webStorage.set('token', res.access_token)
          webStorage.setExpireIn('token', res.expire_in * 1000)
          webStorage.remove('loginInfo')
          commit('updateTokenStatus', true)
          dispatch('getUser')
          resolve(response)
        } else {
          reject(response)
        }
      }).catch(function (error) {
        reject(error.response.data)
      })
    })
  }
}

export default {
  state,
  mutations,
  actions
}