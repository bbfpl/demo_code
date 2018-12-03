import * as types from '../mutation-types'
import webStorage from '../../utils/webStorage'
let state = webStorage.get('customized') || {}

const mutations = {
  [types.SET_CUSTOMIZED_INFO](state, info) {
    webStorage.set('customized', info)
    Object.assign(state, info)
  },
  [types.RESET_CUSTOMIZED_INFO](state) {
    state = {}
    webStorage.remove('CUSTOMIZED_INFO')
  }
}

const actions = {}

export default {
  state,
  mutations,
  actions
}