import * as types from '../mutation-types'
import http from '@/utils/http'
import api from '@/config/api'
import Interceptor from '@/utils/interceptor'
import Store from '../index'

let loading = false

const initUser = {
  nickname: '',
  avatar: '',
  avatar_thumb: '',
  phone: '',
  phone_country_code: '',
  email: null,
  is_set_password: true,
  created_at: '',
  is_bind_oauth: true,
  wallet: ''
}
let state = {}
Object.assign(state, initUser)
const mutations = {
  [types.SET_USER_INFO](state, info) {
    Object.assign(state, info)
  },
  resetUserInformation(state) {
    Object.assign(state, initUser)
  }
}

const actions = {
  getUser({dispatch, commit}) {
    if (loading) {
      return
    }
    loading = true
    return new Promise(function (resolve, reject) {
      http.get(api.APIS.getUser, Interceptor.httpConfig(true)).then((res) => {
        // 请求成功
        loading = false
        if (!res.data.meta.msg) { // 无错误信息
          commit('SET_USER_INFO', res.data.data)
          resolve(res)
        } else { // 有错误信息
          let errorNotice = res.data.meta.msg[Store.state.currentLang]
          dispatch('pushNotification', {notice: errorNotice})
          reject(errorNotice)
        }
      }, (error) => {
        // 请求失败
        let errorNotice = error.response.data.meta.msg[Store.state.currentLang]
        loading = false
        reject(errorNotice)
      })
    })
  }
}

export default {
  state,
  mutations,
  actions
}