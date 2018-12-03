import * as types from './mutation-types'
import webStorage from '@/utils/webStorage'

export default {
  [types.SET_SAFE_CODE](state, code) {
    state.safeCode = code
  },
  clearToken(state) {
    webStorage.remove('token')
    state.hasToken = false
  },
  updateTokenStatus(state, status) {
    state.hasToken = status
  },
  setAreaCode(state, code) {
    state.areaCode = code
  },
  setShowModal(state, status) {
    state.showModal = status
  }
}
