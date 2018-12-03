function push(that, {
  val,
  currentType = 'error' // 'error' || 'notice'
}) {
  let arr = that.data.notificationArr
  arr.push({
    currentType: currentType,
    val: val
  })
  that.setData({
    notificationArr: arr
  })

  setTimeout(function () {
    arr.shift()
    that.setData({
      notificationArr: arr
    })
  }, 3000)
  // let currentNotice = {
  //   currentType: currentType,
  //   val: val
  // }
  // App.globalData.notificationArr.push(currentNotice)

  // setTimeout(function() {
  //   App.globalData.notificationArr.shift()
  // }, 3000)
}

function reset() {

}

export default {
  push: push
}