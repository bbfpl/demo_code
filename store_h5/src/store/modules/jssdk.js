import * as types from '../mutation-types'
import http from '@/utils/http'
import api from '@/config/api'
import Interceptor from '@/utils/interceptor'

let state = {}

const mutations = {
  [types.GET_JSSDK_INFO](state, info) {
    Object.assign(state, info)
  }
}

const actions = {
  getJsSdk({
    commit
  }) {
    return new Promise(function (resolve, reject) {
      http.get(api.APIS.getJssdk, Interceptor.httpConfig()).then((res) => {
        commit('GET_JSSDK_INFO', res.data.data)
        resolve(res.data.data)
      })
    })
  }
}

export default {
  state,
  mutations,
  actions
}