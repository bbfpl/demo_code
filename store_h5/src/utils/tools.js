/** ****** 以下是监听 ******/
let listener = {
  addListener: (method, fac) => {
    if (window.addEventListener) {
      window.addEventListener(method, fac)
    } else if (window.attachEvent) {
      window.attachEvent(method, fac)
    }
  },
  removeListener: (method, fac) => {
    if (window.addEventListener) {
      window.removeEventListener(method, fac, false)
    } else if (window.attachEvent) {
      window.detachEvent(method, fac, false)
    }
  }
}
/** ****** 以下是监测客户端 ******/
function browserRedirect() {
  let sUserAgent = navigator.userAgent.toLowerCase()
  let bIsIpad = sUserAgent.match(/ipad/i) === 'ipad'
  let bIsIphoneOs = sUserAgent.match(/iphone os/i) === 'iphone os'
  let bIsMidp = sUserAgent.match(/midp/i) === 'midp'
  let bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) === 'rv:1.2.3.4'
  let bIsUc = sUserAgent.match(/ucweb/i) === 'ucweb'
  let bIsAndroid = sUserAgent.match(/android/i) === 'android'
  let bIsCE = sUserAgent.match(/windows ce/i) === 'windows ce'
  let bIsWM = sUserAgent.match(/windows mobile/i) === 'windows mobile'
  if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
    return 'touchstart' // 手机
  } else {
    return 'mousedown' // pc
  }
}

/** ****** 以下是触摸 ******/
function mouseListener(e, method, fac) {
  if (e.addEventListener) {
    e.addEventListener(method, fac)
  } else if (e.attachEvent) {
    e.attachEvent(method, fac)
  }
}
// mouseListener(window,'resize', ()=>{
//   browserRedirect()
// })
let toucheHandel = {
  // 用这个了 因为要在pc端使用
  mouseLongPress(e, el) {
    let oldTime
    let curTime
    let longPressTime = 500
    let myEvent = browserRedirect()
    let myEvent2 = myEvent === 'touchstart' ? 'touchend' : 'mouseup'
    mouseListener(e, myEvent, (e) => {
      oldTime = +new Date()
    })
    mouseListener(e, myEvent2, (e) => {
      curTime = +new Date()
      let isLongClick = curTime - oldTime > longPressTime
      if (!isLongClick) return
      return (el.value)()
    })
  },
  mouseLeftSlide(e, el) {
    let oldClientX
    let curClientX
    let longClientX = 50
    let myEvent = browserRedirect()
    let myEvent2 = myEvent === 'touchstart' ? 'touchend' : 'mouseup'
    mouseListener(e, myEvent, (e) => {
      if (myEvent === 'mousedown') {
        oldClientX = e.clientX
      } else {
        oldClientX = e.touches[0].clientX
      }
    })
    mouseListener(e, myEvent2, (e) => {
      if (myEvent === 'mousedown') {
        curClientX = e.clientX
      } else {
        curClientX = e.changedTouches[0].clientX
      }
      let isLeftSlide = Math.abs(curClientX - oldClientX) > longClientX
      if (!isLeftSlide) return
      return (el.value)()
    })
  }
}

let reg = {
  email: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/

}
let tools = {
  listener,
  toucheHandel,
  reg
}
export default tools