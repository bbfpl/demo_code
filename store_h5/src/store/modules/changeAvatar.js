import * as types from '../mutation-types'

let state = {
  url: '',
  imagePath: '',
  avatarChanging: false
}

const mutations = {
  [types.SET_URL](state, url) {
    state.url = url
  },
  [types.SET_IMAGE_PATH](state, path) {
    state.imagePath = path
  },
  [types.SET_AVATAR_CHANGE_STATUS](state, status) {
    state.avatarChanging = status
  },
}

export default {
  state,
  mutations
}
