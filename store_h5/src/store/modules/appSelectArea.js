import * as types from '../mutation-types'

let state = {
  show: false,
  province: {
    code: '',
    name: ''
  },
  city: {
    code: '',
    name: ''
  }
}

const mutations = {
  [types.SET_AREA_INFO](state, infoObj) {
    state.province = infoObj.province
    state.city = infoObj.city
  },
  [types.SET_SHOW_SELECT_AREA_STATUS](state, status) {
    state.show = status
  },
  [types.RESET_AREA_INFO](state) {
    state.province = {
      code: '',
      name: ''
    }
    state.city = {
      code: '',
      name: ''
    }
  }
}

const actions = {}

export default {
  state,
  mutations,
  actions
}
