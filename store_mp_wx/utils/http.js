import appStorage from './appStorage.js'
const Api = require('../config/api.js')
const UtilsUpload = require('./upload.js')

function httpConfig(checkAuth = false) {
  let headers = {
    'Accept': 'application/json',
    'Platform': 'store/mp/1.0.0',
    'Content-Type': 'application/json; charset=utf-8'
  }

  if (checkAuth) {
    // let token = webStorage.getUnExpiredVal('token')
    //我是懒人 懒人～～～
    // headers['Authorization'] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdG9yZUBQYW5kYUVhcnRoIiwiaWF0IjoxNTM2NzMzNzM5LCJleHAiOjE1MzczMzg1MzksInV1aWQiOiJlOWVhNzEyMS0zMDA2LTRhYzgtYmNkMi04YTg3MGI4NGQwOTAifQ.bUslQqk9_V940_6rkZLB8XzQTi6-IFGnwGYUBEzuifs'
    const TOKEN = appStorage.getUnExpiredVal('TOKEN')
    headers['Authorization'] = TOKEN || ''
  }
  return headers
}

function request(api = "", data = {}, checkAuth = false, method = "GET") {
  let that = this;

  return new Promise(function(resolve, reject) {
    wx.request({
      url: api,
      data: data,
      method: method,
      header: httpConfig(checkAuth),
      success: function(res) {
        if (res.statusCode === 200 && !res.data.meta.msg) {
          resolve(res);
        } else {
          reject(res)
        }
      },
      fail: function(err) {
        reject(err)
      }
    })
  });
}

function get(api, checkAuth) {
  return request(api, checkAuth, 'get')
}

function post(api, data, checkAuth) {
  return request(api, data, checkAuth, 'post')
}

function put(api, data, checkAuth) {
  return request(api, data, checkAuth, 'put');
}

function patch(api, data, checkAuth) {
  return request(api, data, checkAuth, 'patch');
}

function del(api, checkAuth) {
  return request(api, {}, checkAuth, 'delete');
}

/************************************************
 * 分割线
 ************************************************/

/** 获取的 oss 参数 */
let oss = null

/** 获取 OSS 参数 */
function getOSS() {
  if (isOSSValid()) {
    return Promise.resolve(oss)
  }
  return get(Api.getOssSignature, true).then(res => {
    oss = res.data
    return oss
  })
}

/** OSS 参数是否有效 */
function isOSSValid() {
  if (oss === null) return false
  if (oss.expire <= 0) return false

  const now = Date.now() / 1000
  return (now + 5) < oss.expire
}

/** 上传图片 */

function uploadImg(filePath) {
  let theFile = ''
  return getOSSFormData(filePath)
    .then(res => {
      const {
        formData,
        uploadedFilename
      } = res
      theFile = uploadedFilename;
      return ApiUploadImgs('https://storage.pandaearth.store', filePath, formData)
    })
    .then(() => ({
      image: theFile,
      thumb: theFile
    }))
}

function getOSSFormData(filePath) {
  return getOSS().then((oss) => {
    return uploadWithOSS(oss, filePath)
  })

  function uploadWithOSS(oss, filePath) {
    const {
      accessid,
      dir,
      host,
      policy,
      signature
    } = oss.data
    const ext_exp = /\.(\w+)$/
    const uuid = UtilsUpload.uuid()
    const extname = ext_exp.exec(filePath)[0]
    const filename = uuid + 'h5' + extname
    const filekey = dir + filename
    const uploadedFilename = host + '/' + filekey

    const formData = {
      name: filename,
      key: filekey,
      policy: policy,
      OSSAccessKeyId: accessid,
      success_action_status: 200,
      signature: signature
    }

    return {
      formData,
      uploadedFilename
    }
  } // end of uploadWith OSS
}

/**
 * 上传图片
 * @param {String} url - 服务器地址
 * @param {String} filePath - 本地文件
 * @param {Object} formData - 表单数据
 */
function ApiUploadImgs(url, filePath, formData) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: url,
      filePath: filePath,
      formData: formData,
      name: 'file',
      success: function(res) {
        resolve(res)
      },
      fail: function(res) {
        reject(res)
      }
    })
  })
}

/************************************************
 * 分割线
 ************************************************/

module.exports = {
  get,
  post,
  put,
  patch,
  del,
  uploadImg
}