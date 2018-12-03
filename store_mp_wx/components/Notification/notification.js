Component({
  /**
   * 组件的属性列表
   */
  properties: {
    notificationArr: {
      type: Object,
      value: [],
      observer: '_propertyChange'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    noticeIcon: '/../../images/common/icon-correct@3x.png',
    errorIcon: '/../../images/common/icon-warning@3x.png'
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 内部方法建议以下划线开头
    _propertyChange: function (newVal, oldVal) {
      // console.log('oldVal', oldVal)
      // console.log('newVal', newVal)
    }
  }
})