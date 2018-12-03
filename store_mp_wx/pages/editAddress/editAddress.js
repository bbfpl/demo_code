let Http = require('../../utils/http.js')
let Api = require('../../config/api.js')
import Notification from '../../utils/notification.js'
const {
  watch,
  computed
} = require('../../utils/vuefy.js')

let initAddress = {}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    notificationArr: [],    
    options: {
      height: "96rpx", // picker高度
      width: "670rpx", // picker宽度
      isTransparent: true // 字体是否透明
    },
    showModalStatus: false,
    modalOptions: {
      title: '确认删除该地址？',
      showCancelButton: true,
      cancelButtonClass: 'btn-cancel',
      cancelButtonText: '取消',
      showSureButton: true,
      sureButtonClass: 'btn-ok',
      sureButtonText: '确定'
    },
    form: {
      consignee: '',
      phoneNumber: '',
      detailedAddress: ''
    },
    isFocus: {
      consignee: false,
      phoneNumber: false,
      detailedAddress: false
    },
    area: '',
    areaObj: {
      province: {
        code: '',
        name: ''
      },
      city: {
        code: '',
        name: ''
      }
    },
    isDefault: false,
    canChangeDefaultStatus: true,
    loading: false,
    disabledSubmit: true,
    deleteLoading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    watch(this, {
      loading: function(newVal) {
        this.updateSubmitStatus()
      }
    })
    this.initPageData()
  },

  initPageData() {
    initAddress = wx.getStorageSync('edit_address_info')
    if (initAddress.is_default) {
      this.data.canChangeDefaultStatus = false
    }

    this.setData({
      form: {
        consignee: initAddress.name,
        phoneNumber: initAddress.phone,
        detailedAddress: initAddress.location
      },
      area: initAddress.province_name + initAddress.city_name,
      areaObj: {
        province: {
          code: initAddress.province_id,
          name: initAddress.province_name
        },
        city: {
          code: initAddress.city_id,
          name: initAddress.city_name
        }
      },
      isDefault: initAddress.is_default,
      canChangeDefaultStatus: this.data.canChangeDefaultStatus
    })
    this.updateSubmitStatus()

    // wx.removeStorage({ key: 'edit_address_info'})

  },

  changeInputStatus(e) {
    let status = e.type === 'focus'
    let key = `isFocus.${e.target.dataset.inputName}`
    this.setData({
      [key]: status
    })
    this.updateSubmitStatus()
  },

  setInputValue(e) {
    let key = `form.${e.target.dataset.inputName}`
    let val = e.detail.value
    this.setData({
      [key]: val
    })
    this.updateSubmitStatus()
  },

  submitArea(e) {
    this.setData({
      area: e.detail.province.name + e.detail.city.name,
      areaObj: e.detail
    })
    this.updateSubmitStatus()
  },

  setDefault() {
    if (!this.data.canChangeDefaultStatus) {
      return
    }
    this.setData({
      isDefault: !this.data.isDefault
    })
    this.updateSubmitStatus()
  },

  updateSubmitStatus() {
    let data = this.data
    let disabledSubmit = data.loading || !data.form.consignee || !data.form.phoneNumber || !data.form.detailedAddress || !data.areaObj

    this.setData({
      disabledSubmit: disabledSubmit
    })
  },

  submitHandler() {
    if (this.data.form.consignee.length > 64) {
      Notification.push(this, {
        val: '收货人最长为64个字符，请修改后重试'
      })
      return
    }
    wx.showLoading({
      title: ''
    })
    if (this.data.loading) {
      return
    }
    this.setData({
      loading: true
    })
    this.editAddress()
  },

  editAddress() {
    let params = {
      'country_id': '86',
      'province_id': this.data.areaObj.province.code,
      'city_id': this.data.areaObj.city.code,
      location: this.data.form.detailedAddress,
      name: this.data.form.consignee,
      phone: this.data.form.phoneNumber,
      is_default: this.data.isDefault
    }

    let api = Api.putAddresses.replace('$addressId', initAddress.id)
    Http.put(api, params, true).then((res) => {
      wx.hideLoading()
      this.setData({
        loading: false
      })
      Notification.push(this, {
        val: '编辑地址成功'
      })
      setTimeout(function () {
        wx.redirectTo({
          url: '/pages/addressList/addressList'
        })
      }, 2000)
    }, (error) => {
      this.setData({
        loading: false
      })
      Notification.push(this, {
        val: error.data.meta.msg.cn
      })
      this.updateSubmitStatus()
      wx.hideLoading()
    })
  },

  deleteHandler() {
    this.setData({
      showModalStatus: true
    })
  },

  ensureDelete() {
    if (this.data.deleteLoading) {
      return
    }
    wx.showLoading({
      title: '',
    })
    this.setData({
      deleteLoading: true,
      loading: true
    })
    this.deleteAddress()
  },

  deleteAddress() {
    let api = Api.delAddresses.replace('$addressId', initAddress.id)
    Http.del(api, true).then((res) => {
      console.log('res', res)
      wx.hideLoading()
      Notification.push(this, {
        val: '删除地址成功',
        currentType: 'notice'
      })
      setTimeout(function () {
        wx.redirectTo({
          url: '/pages/addressList/addressList'
        })
      }, 2000)
    }, (error)=> {
      this.setData({
        deleteLoading: false,
        loading: false
      })
    })
  },
})