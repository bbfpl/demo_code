const wxPromisify = require('../utils/wxPromisify.js')

const login = wxPromisify(wx.login)
const getUserInfo = wxPromisify(wx.getUserInfo)

let loginData = {}

function getLoginParams() {
  return login().then(res => {
    loginData.code = res.code
    return getUserInfo()
  }).then(res => {
    const {
      encryptedData,
      signature,
      rawData,
      iv
    } = res

    loginData.encrypted_data = encryptedData
    loginData.signature = signature
    loginData.raw_data = rawData
    loginData.iv = iv
    return loginData
  }).catch(e => {
    return Promise.reject('Not userInfo Authed')
  })
}

module.exports = {
  getLoginParams
}