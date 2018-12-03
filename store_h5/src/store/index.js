import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import actions from './actions'
import login from './modules/login'
import user from './modules/user'
import jssdk from './modules/jssdk'
import message from './modules/message'
import notification from './modules/notification'
import appSelectArea from './modules/appSelectArea'
import selectAddress from './modules/selectAddress'
import address from './modules/address'
import changeAvatar from './modules/changeAvatar'
import customized from './modules/customized'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state: state,
  mutations,
  actions,
  modules: {
    login,
    user,
    jssdk,
    message,
    notification,
    appSelectArea,
    selectAddress,
    address,
    changeAvatar,
    customized
  },
  strict: debug
})