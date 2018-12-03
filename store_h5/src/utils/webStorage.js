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
  set(key, val) {
    if (typeof (val) === 'object') {
      val = JSON.stringify(val)
    }
    window.localStorage.setItem(key, val)
  },
  get(key) {
    let val = window.localStorage.getItem(key)
    if (val) {
      if (isJsonStr(val)) {
        return JSON.parse(val)
      } else {
        return val
      }
    } else return null
  },
  remove(key) {
    window.localStorage.removeItem(key)
    window.localStorage.removeItem(`expire_in_${key}`)
  },
  setExpireIn(key, val) {
    // val为毫秒
    let expireTime = curTime + val
    window.localStorage.setItem(`expire_in_${key}`, expireTime)
  },
  getUnExpiredVal(key) {
    let val = window.localStorage.getItem(key)
    if (val) {
      val = isJsonStr(val) ? JSON.parse(val) : (val || '')
    }
    let keyExpireIn = window.localStorage.getItem(`expire_in_${key}`)
    if (val && keyExpireIn && (keyExpireIn > curTime)) {
      return val
    } else {
      return false
    }
  }
}

// export default {
//   /**
//    * stores 与 stores是否过期
//    */
//   set(key, value) {
//     return stores.set(key, value)
//   },
//   get(key) {
//     return stores.get(key)
//   },
//   remove(key) {
//     return stores.remove(key)
//   },
//   clear() {
//     return stores.clear()
//   },
//   // 这里本来要分离的 只有两个 久合并在这里了
//   setTokenTiming(key, value) {
//     var curTime = parseInt(new Date().getTime())
//     return stores.set(key, JSON.stringify({ data: value, time: curTime }))
//   },
//   getTokenTiming(key) {
//     let keys = stores.get(key) || ''
//     if (keys !== '') {
//       var data = stores.get(key)
//       var dataObj = JSON.parse(data)
//       if (parseInt((new Date().getTime() - dataObj.time) / 1000) > dataObj.data.expire_in) {
//         stores.remove(key)
//         return false // 'token过期'
//       } else {
//         return dataObj.data
//       }
//     } else {
//       stores.remove(key)
//       return false // 'token过期'
//     }
//   }
// }