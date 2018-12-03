<template>

  <div class="panel user-order-express-panel">

    <div class="container">
      <header-white-bg>物流</header-white-bg>
      <div class="express-list space">
        <div class="export-item flex" v-for="(item,index) in logistics.detail">
          <div class="export-item-time">
            <p>{{item.time.t1}}</p>
            <p>{{item.time.t2}}</p>
          </div>
          <div class="export-item-icon">
            <i></i>
          </div>
          <p class="export-item-text">
            {{item.content}}
          </p>
        </div>

        <p class="text-center" v-if="noData">暂无物流信息</p>
      </div>

    </div>

  </div>

</template>

<script>
  import Api from '@/config/api'
  import Http from '@/utils/http'
  import Interceptor from '@/utils/interceptor'

  import HeaderWhiteBg from '@/components/header/HeaderWhiteBg'

  export default {
    name: 'UserOrderExpressPage',
    components: {
      HeaderWhiteBg
    },
    data() {
      return {
        logistics: {}
      }
    },
    computed: {
      noData() {
        return !this.logistics.detail
      }
    },
    created() {
      this.getUserOrderLogistics()
    },
    mounted() {

    },
    methods: {
      // 获取物流信息
      getUserOrderLogistics() {
        let that = this
        let api = Api.APIS.getUserOrderLogistics.replace('$orderNo', that.$route.params.orderNo)
        Http.get(api, Interceptor.httpConfig(true)).then(data => {
          let _data = data.data.data
          if (_data.detail.length > 0) {
            _data.detail.forEach(function (v) {
              v.time = that.time(v.created_at)
            })
          }
          this.logistics = _data
        })
      },
      time(value) {
        let time = new Date(value)
        // let y = time.getFullYear()
        let m = time.getMonth() + 1
        let d = time.getDate()
        let h = time.getHours()
        let mm = time.getMinutes()
        // let s = time.getSeconds();
        return {
          t1: m + '-' + d,
          t2: h + ':' + mm
        }
      }
    }
  }
</script>
