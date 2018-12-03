import * as types from '../mutation-types'
import http from '@/utils/http'
import api from '@/config/api'
import Interceptor from '@/utils/interceptor'
import {getArrItemByKey} from '../../utils/arrHandler'

let initAddress = {
  'id': '',
  'country_id': '',
  'country_name': '',
  'country_name_en': '',
  'province_id': '',
  'province_name': '',
  'city_id': '',
  'city_name': '',
  'location': '',
  'name': '',
  'phone': '',
  'is_default': false,
  'created_at': ''
}
let state = {
  addressList: [initAddress],
  editAddressObj: initAddress,
  defaultAddress: initAddress
}
const mutations = {
  [types.SET_ADDRESS_LIST](state, arr) {
    state.addressList = arr
  },
  [types.SET_EDIT_ADDRESS_INFO](state, addressObj) {
    state.editAddressObj = addressObj
  },
  [types.SET_DEFAULT_ADDRESS_INFO](state, addressObj) {
    state.defaultAddress = addressObj
  },
  [types.RESET_ADDRESS_LIST](state) {
    state.addressList = [initAddress]
  },
  [types.RESET_DEFAULT_ADDRESS_INFO](state) {
    state.defaultAddress = initAddress
  }
}

const actions = {
  getAddresses({dispatch, commit}) {
    return new Promise(function (resolve, reject) {
      http.get(api.APIS.getAddresses, Interceptor.httpConfig(true)).then((res) => {
        if (res.data.data.length === 0) {
          commit('RESET_ADDRESS_LIST')
          commit('RESET_DEFAULT_ADDRESS_INFO')
          resolve(res)
          return
        }

        commit('SET_ADDRESS_LIST', res.data.data)

        let addressObj = getArrItemByKey(res.data.data, 'is_default', true)
        commit('SET_DEFAULT_ADDRESS_INFO', addressObj)

        resolve(res)
      }, (error) => {
        dispatch('pushNotification', {notice: error})
        console.log('getLocations error', error)
        reject(error)
      })
    })
  },
  setEditAddressInfo({commit}, info) {
    return new Promise(function (resolve) {
      commit('SET_EDIT_ADDRESS_INFO', info)
      resolve()
    })
  },
  getEditAddressObj() {
    return state.address.editAddressObj
  }
}

export default {
  state,
  mutations,
  actions
}
