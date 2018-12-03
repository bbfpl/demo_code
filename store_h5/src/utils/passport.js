
// import api from '@/config/api'

// import http from '@/utils/http'
// import utils from '@/utils/utils'
import webStorage from '@/utils/webStorage'

export default {
  setToken: token => {
    // 在登录页面set
  },
  hasAuthToken: () => {
    if (webStorage.getUnExpiredVal('token')) {
      return true
    } else {
      return false
    }
  }
}
