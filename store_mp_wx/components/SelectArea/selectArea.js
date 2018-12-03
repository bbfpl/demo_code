let Http = require('../../utils/http.js')
let Api = require('../../config/api.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // picker高度
    height: {
      type: String,
      value: "96rpx",
      observer: function(newVal, oldVal) {

      }
    },
    // picker宽度
    width: {
      type: String,
      value: "100%",
      observer: function(newVal, oldVal) {

      }
    },
    // 字体是否透明
    isTransparent: {
      type: Boolean,
      value: true,
      observer: function(newVal, oldVal) {

      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    indexArr: [0, 0],
    locations: [],
    allAddress: [
      [],
      []
    ]
  },

  ready() {
    Http.get(Api.getLocation).then((res) => {
      console.log(res)
      let arr = res.data.data
      let provinceArr = arr.map(function(item) {
        return {
          code: item.code,
          name: item.name
        }
      })
      this.setData({
        locations: arr,
        'allAddress[0]': provinceArr,
        'allAddress[1]': arr[0].children
      })
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindPickerColumnChange(e) {
      let column = e.detail.column
      let index = e.detail.value

      if (column === 0) { // 选择省
        let cityArr = this.data.locations[index].children
        let indexArr = [index, 0]
        this.setData({
          indexArr: indexArr,
          'allAddress[1]': cityArr
        })
      } else if (column === 1) { // 选择市
        this.setData({
          'indexArr[1]': index
        })
      }
    },

    bindMultiPickerChange(e) {
      console.log('e2', e)
      let provinceIndex = this.data.indexArr[0]
      let province = this.data.locations[provinceIndex]
      let cityIndex = this.data.indexArr[1]

      let params = {
        province: {
          code: province.code,
          name: province.name
        },
        city: province.children[cityIndex]
      }
      this.triggerEvent('selectedArea', params)
    }
  }
})