const USER_INFO = 'scope.userInfo'

function checkScope(scope) {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: res => {
        if (res.authSetting[scope]) {
          resolve(true)
        } else {
          reject(false)
        }
      }
    })
  })
}

module.exports = {
  USER_INFO,
  checkScope
}