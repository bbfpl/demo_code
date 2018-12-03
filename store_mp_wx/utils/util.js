const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function isEmpty(obj) {
  if (typeof obj === 'undefined' || obj === null || obj === '') {
    return true
  } else {
    return false
  }
}

function time(value){
  if (value !== undefined) {
    let time = new Date(value)
    let y = time.getFullYear()
    let m = time.getMonth() + 1
    let d = time.getDate()
    let h = time.getHours()
    let mm = time.getMinutes()
    // let s = time.getSeconds();
    return y + '.' + m + '.' + d + ' ' + h + ':' + mm
  }
}

function promiseFun(fn) {
  return new Promise((resolve, reject) => {
    fn({
      success: function (res) {
        resolve(res)
      },
      fail: function (res) {
        reject(res)
      }
    })
  })
}

module.exports = {
  formatTime: formatTime,
  isEmpty: isEmpty,
  time: time,
  promiseFun: promiseFun
}
