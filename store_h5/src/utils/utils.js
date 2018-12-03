// import base64 from './base64.js'
// import store from '@/utils/store'

export default {
  /**
   * 获取URL参数
   * @param key key(Y)
   * @param url 需要获取key的目标URL(N)
   */
  getUrlParam(key, url) {
    if (!url) {
      let reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i')
      let r = window.location.search.substr(1).match(reg)
      if (r !== null) return r[2]
      return null
    } else {
      let reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i')
      let split = url.split('?')
      if (split.length === 1) {
        return null
      } else {
        let r = split[1].match(reg)
        if (r !== null) return r[2]
        return null
      }
    }
  },
  message(message) {

  },
  error(message) {
    // toast(`【 ${message} 】`)
    // console.log(message);
  },
  success(message = '成功') {
    return Promise.resolve()
  },
  isEmpty(obj) {
    if (typeof obj === 'undefined' || obj === null || obj === '') {
      return true
    } else {
      return false
    }
  },
  filteremoji(val) {
    const ranges = [
      '\ud83c[\udf00-\udfff]',
      '\ud83d[\udc00-\ude4f]',
      '\ud83d[\ude80-\udeff]'
    ]
    return val.replace(new RegExp(ranges.join('|'), 'g'), '')
  },
  guid(e) {
    e = e !== '' ? 16 : e
    for (var t = '', i = 1; i <= e; i++) {
      let n = 16 * Math.random()
      t += Math.floor(n).toString(16)
    }
    return t
  },
  random_string(e = 32) {
    let t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    let n = t.length
    let r = ''
    for (let i = 0; i < e; i++) r += t.charAt(Math.floor(Math.random() * n))
    return r
  },
  get_suffix(img) {
    let t = img.lastIndexOf('.')
    let i = ''
    t !== -1 && (i = img.substring(t))
    const n = ['jpg', 'jpeg', 'png', '.gif']
    return n.indexOf(i) === -1 && (i = n[0]), i
  },

  is_weixin() {
    let ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      return true;
    } else {
      return false;
    }
  },

  format(datetime) {
    let time = new Date(datetime)
    let y = time.getFullYear()
    let m = time.getMonth() + 1
    let d = time.getDate()
    let h = time.getHours()
    let mm = time.getMinutes()
    let s = time.getSeconds()
    return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s
  }
}