let Http = require('../../utils/http.js')
let Api = require('../../config/api.js')
const wxPromisify = require('../../utils/wxPromisify.js')
let WxChooseImages = wxPromisify(wx.chooseImage)


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 上传图片张数限制，默认9张
    limit: {
      type: Number,
      value: 9,
      observer: function(newVal, oldVal) {}
    },
    borderRadius: {
      type: String,
      value: '48rpx',
      observer: function(newVal, oldVal) {}
    },
    changeSuccess: {
      type: String, //'success || fail'
      value: '',
      observer: function(newVal, oldVal) {
        if (newVal === 'fail') {
          this._computedDisabledSubmit(false)

          this._reset()
        }
      }
    }

  },

  /**
   * 组件的初始数据
   * 上传后的图片数组 images 包含以下值
   * images 原图路径
   * thumb 缩略图路径
   * state 上传状态
   * 
   * 上传状态 state 有以下取值
   * 0 uploading
   * 1 upload success
   * 2 upload error
   */

  data: {
    images: [],
    state: '',
    disabledSubmit: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 重置组件
    _reset() {
      this.setData({
        images: [],
        state: '',
        disabledSubmit: false,
        changeSuccess: ''
      })
    },
    _computedDisabledSubmit(status) {
      this.setData({
        disabledSubmit: status
      })
    },
    _chooseImage(e) {
      this._computedDisabledSubmit(true)

      let count = this.data.limit
      if (this.data.images.length > 0) {
        count = count - this.data.images.length
      }

      WxChooseImages({
        count: count
      }).then(res => {
        const tempFilePaths = res.tempFilePaths

        this._uploadImages(tempFilePaths).then((res) => {
          this.triggerEvent('uploadImgsEnd', {
            currentType: 'success',
            res: res
          })
        }, (error) => {
          this.triggerEvent('uploadImgsEnd', {
            currentType: 'fail',
            res: error
          })
        })
      }, (error) => {
        this._computedDisabledSubmit(false)
      })
    },

    // 开始上传图片
    _uploadImages(files) {
      let base = this.data.images.length
      let arr = []

      files.forEach((item, idx) => {
        const theIndex = base + idx
        arr.push(this._uploadSingleImage(item, theIndex))
      })

      return Promise.all(arr)
    },

    /**
     *
     * @param {String} file - 本地图片路径
     * @param {Number} index - 第几张图片
     * 
     */
    _uploadSingleImage(file, index) {
      wx.showLoading({
        title: '上传图片中...',
      })

      let that = this
      return new Promise(function(resolve, reject) {
        Http.uploadImg(file).then(res => {
          that.setData({
            [`images[${index}].image`]: res.image,
            [`images[${index}].thumb`]: res.thumb,
            [`images[${index}].state`]: 1
          })

          resolve({
            'index': index,
            'imagesInfo': res
          })
        }).catch(err => {
          that.setData({
            [`images[${index}].state`]: 2
          })
          reject('upload images fail')
        }).then(() => {
          wx.hideLoading()
        })
      })
    },


    // 重新上传图片 
    _onRetry(e) {
      const {
        src,
        index
      } = e.currentTarget.dataset
      this.uploadSingleImage(src, index)
    },


    //删除图片
    _removeImage(e) {
      const {
        index
      } = e.currentTarget.dataset
      let images = this.data.images
      images.splice(index, 1)
      this.setData({
        [`images`]: images
      })
    },

    // 预览图片
    _previewImage(e) {
      const {
        src
      } = e.currentTarget.dataset
      const urls = this.data.images.map(item => item.image)

      wx.previewImage({
        current: src,
        urls: urls
      })
    }
  }
})