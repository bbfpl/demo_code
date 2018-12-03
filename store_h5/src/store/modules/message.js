import * as types from '../mutation-types'
import http from '@/utils/http'
import api from '@/config/api'
import Interceptor from '@/utils/interceptor'
import webStorage from '@/utils/webStorage'

let state = {
  isNew: false,
  maxId: 0
}
const mutations = {
  [types.GET_MESSAGE_MAXID](state, v) {
    state.maxId = v
  },
  [types.GET_MESSAGE_ISNEW](state, v) {
    state.isNew = v
  }
}
const actions = {
  getNewMessage({
    commit
  }) {
    return new Promise(function (resolve, reject) {
      http.get(api.APIS.getUserMessages, Interceptor.httpConfig(true)).then((res) => {
        let data = res.data.data
        let id = 0
        if (data.length > 0) {
          id = data[0]['id']
        }
        let _smid = webStorage.get('msg_max_id') || 0

        commit('GET_MESSAGE_MAXID', parseInt(_smid))
        commit('GET_MESSAGE_ISNEW', id > _smid)

        resolve(res)
      })
    })
  }
}

export default {
  state,
  mutations,
  actions
}