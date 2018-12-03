import * as types from '../mutation-types'

const state = {
  notificationArr: []
}

const mutations = {
  [types.RESET_NOTIFICATION_ARR](state) {
    state.notificationArr = []
  },
  [types.PUSH_NOTIFICATION](state, {notice, type = 'error'}) {
    state.notificationArr.push({
      type: type,
      notice: notice,
      showStatus: true
    })
  },
  [types.SHIFT_NOTIFICATION](state) {
    state.notificationArr.shift()
  }
}

const actions = {
  pushNotification({commit}, noticeObj) {
    commit('PUSH_NOTIFICATION', noticeObj)
    setTimeout(function () {
      commit('SHIFT_NOTIFICATION')
    }, 3000)
  }
}

export default {
  state,
  mutations,
  actions
}
