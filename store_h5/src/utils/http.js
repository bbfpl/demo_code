import axios from 'axios'
let jsonp = require('jsonp')

export default {
  /**
   * request请求
   */
  req: (api, type = 'get', data = {}, config = {}) => {
    return axios[type](api, data, config)
  },
  get: (api, config = {}, params = {}) => {
    return axios({
      method: 'get',
      url: api,
      data: {},
      params: params,
      headers: config
    })
  },
  post: (api, data, config = {}) => {
    return axios['post'](api, data, config)
  },
  put: (api, data, config = {}) => {
    return axios['put'](api, data, config)
  },
  patch: (api, data, config = {}) => {
    return axios['patch'](api, data, config)
  },
  del: (api, config = {
    headers: ''
  }) => {
    return axios({
      method: 'delete',
      url: api,
      data: {},
      headers: config.headers
    })
  },
  jsonp: (api, config = {}, callback) => {
    return jsonp(api, config, callback)
  }
}