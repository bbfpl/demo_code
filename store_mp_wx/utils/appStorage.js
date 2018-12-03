const curTime = new Date().getTime()

function isJsonStr(str) {
  try {
    let obj = JSON.parse(str)
    if (typeof obj === 'object' && obj) {
      return true
    } else {
      return false
    }
  } catch (e) {
    return false
  }
}

export default {
  setExpireIn(key, val) {
    // val为毫秒
    let expireTime = curTime + val
    wx.setStorageSync(`expire_in_${key}`, expireTime)
  },
  getUnExpiredVal(key) {
    let val = wx.getStorageSync(key)
    if (val) {
      val = isJsonStr(val) ? JSON.parse(val) : (val || '')
    }
    let keyExpireIn = wx.getStorageSync(`expire_in_${key}`)
    if (val && keyExpireIn && (keyExpireIn > curTime)) {
      return val
    } else {
      return false
    }
  }
}