<template>

  <div class="panel record-panel tool-footer-bar">
    <div class="container">
      <div class="header-toolbar">
        <!--返回按钮-->
        <BackButton></BackButton>
      </div>
      <h1 class="space">交易记录</h1>

      <LoadingPage :loading="loading"></LoadingPage>
      <div class="container">
        <!-- 熊猫列表 -->
        <div class="order-list space">
          <template v-if="orders.length > 0">
            <div class="order-item-block" v-for="(item,index) in orders">
              <p class="order-item-time">{{item.created_at|time}}</p>
              <div class="order-item flex flex-between">
                <div class="order-item-info">
                  <router-link :to="{path:'/user/order_detail/'+item.order_no}">
                    <div class="flex">
                      <strong class="strong">{{item.product.title}}</strong>
                      <div class="flex center">
                        <span class="status">发布中</span>
                      </div>
                    </div>
                    
                    <p>{{item.product.category_name}} · ¥ {{item.product.amount}}</p>
                  </router-link>
                  <div class="order-item-btns flex">

                    <!-- <template v-if="item.status.status === 4">
                      <a class="button white small">确认收货</a>
                      <router-link :to="{path:'/user/order_express/'+item.order_no}" class="button white small">
                        查看物流
                      </router-link>
                    </template> -->

                  </div>
                </div>
                <div class="order-item-img">
                  <router-link :to="{path:'/user/order_detail/'+item.order_no}">
                    <img :src="item.product.head_image.thumb">
                  </router-link>
                </div>
              </div>
            </div>
          </template>

          <template v-if="isNoData">
            <div class="no-data">
              <img src="/static/img/user/img_default_order.png">
              <span>暂无订单</span>
            </div>
          </template>
        </div>
      </div>

    </div>
  </div>

</template>

<script>
  import Api from '@/config/api'
  import Tools from '@/utils/tools'
  import Http from '@/utils/http'
  import Interceptor from '@/utils/interceptor'
  // import OrderStatus from './orderStatus.js'

  import LoadingPage from '@/components/LoadingPage'
  import BackButton from '@/components/BackButton'
  export default {
    name: 'RecordPage',
    components: {
      BackButton,
      LoadingPage
    },
    data() {
      return {
        loading: false,
        // 订单数据
        orders: [],
        // 分页-当前页数
        page: 1,
        // 分页-每页多少条数据
        size: 10,
        // 加载完成
        isLoaded: true,
        // 是否可以滚动
        isScroll: true,
        isNoData: false
      }
    },
    created() {
      this.init()
    },
    beforeDestroy() {
      Tools.listener.removeListener('scroll', this.scrollLoading)
    },
    methods: {
      init() {
        this.getUserOrders()
        Tools.listener.addListener('scroll', this.scrollLoading)

      },
      // 滚动加载
      scrollLoading() {
        let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        let innerHeight = window.innerHeight
        let scrollH = document.body.scrollHeight - 200

        if (scrollTop + innerHeight >= scrollH && this.isScroll === true && this.isLoaded === true) {
          this.page++
          this.getUserOrders()
        }
      },
      getUserOrders() {
        this.loading = true
        this.isLoaded = false

        Http.get(Api.APIS.getUserOrders, Interceptor.httpConfig(true), {
          page: this.page,
          size: this.size
        }).then(data => {
          let _data = data.data.data
          if (_data.length !== 0) {
            _data.forEach(function (v) {
              // v.status = OrderStatus.getStatus(v)
            })
          }else{
            this.isNoData = true
          }
          // 如果数据小于10条没有更多数据
          if (_data.length < 11) {
            this.isScroll = false
          }

          this.orders = this.orders.concat(_data.slice(0, 10))
          this.isLoaded = true
          this.loading = false
        }).catch(function (error) {
          that.loading = false
        })
      }
    }
  }
</script>
