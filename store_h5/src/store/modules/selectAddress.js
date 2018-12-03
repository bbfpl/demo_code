import * as types from '../mutation-types'

let state = {}

const mutations = {
  [types.SET_ADDRESS_INFO](state, info) {
    Object.assign(state, info)
  },
  [types.RESET_ADDRESS_INFO](state) {
    state = {}
  }
}

const actions = {}

export default {
  state,
  mutations,
  actions
}