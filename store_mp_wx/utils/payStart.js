const Api = require('../config/api.js');
const Http = require('../utils/http.js');

function init(callback) {
  // 先判断是否可以支付了
  hasOpenId(callback)
}
//hasopenid
function hasOpenId(callback) {
  Http.get(Api.getOpenid, {
    app_id:'wx2e3b7f3d0f876774'
  }, true).then(data => {
    let _data = data.data.data
    if (_data !== null && _data.has_open_id) {
      callback()
    } else {
      getWxCode(callback)
    }
  })
}

function getWxCode(callback) {
  wx.login({
    success: function(res) {
      if (res.code) {
        postOpenId(res.code, callback);
      } else {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    }
  });
}

function postOpenId(code, callback) {
  Http.post(Api.postOpenid, {
    code: code,
    app_id: 'wx2e3b7f3d0f876774'
  }, true).then(data => {
    let _data = data.data.data
    if (_data !== null && _data.has_open_id === true && _data.has_open_id !== undefined) {
      callback()
    } else {
      // 重新获取code
      console.log('post open id error');
    }
  })
}
module.exports = {
  init: init
}