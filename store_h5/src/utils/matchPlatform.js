function matchPlatform() {
  let appVersion = window.navigator.appVersion
  let platform = window.navigator.platform
  if (appVersion.indexOf('Android') > -1) {
    return 'android'
  } else if (appVersion.indexOf('iPhone') > -1 || appVersion.indexOf('iPod') > -1 || appVersion.indexOf('iPad') > -1) {
    return 'ios'
  } if (platform.indexOf('Linux') > -1) {
    return 'ubuntu'
  } else if (appVersion.indexOf('Mac') > -1) {
    return 'mac'
  } else {
    return 'windows'
  }
}

export {
  matchPlatform
}
