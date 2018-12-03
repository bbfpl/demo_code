import Vue from 'vue'

Vue.filter('time', function (value) {
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
})

// paymentType
Vue.filter('paymentType', function (value) {
  if (value === 'wxpay') {
    return '微信支付'
  }
})