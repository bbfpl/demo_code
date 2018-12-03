function isWeChat() {
  let ua = window.navigator.userAgent.toLowerCase()
  if (ua.indexOf('micromessenger') > -1) {
    return true
  } else {
    return false
  }
}

export {
  isWeChat
}