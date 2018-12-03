<template>

  <div class="panel user-order-panel tool-footer-bar">
    <UserHeader></UserHeader>
    <LoadingPage :loading="loading"></LoadingPage>
    <div class="container">

      <!-- 订单列表 -->
      <div class="space order-list">

        <template v-if="orders.length > 0">
          <router-link :to="{path:'/user/order_detail/'+item.order_no}" v-for="(item,index) in orders" :key="index">
            <div class="flex flex-between order-item-box">
              <div class="flex flex-center img-box"><img class="img" :src="item.product.head_image.thumb"></div>
              <div class="info-box">
                <p class="title">{{item.product.title}}</p>
                <p class="status-box"><span class="status">购买成功</span></p>
                <p class="time">{{item.created_at|time}}</p>
              </div>
              <div class="amount-box">¥{{item.product.amount}}</div>
            </div>
          </router-link>

          <!--<div class="order-item-box" v-for="(item,index) in orders" :key="index">-->
          <!--<p class="time">{{item.created_at|time}}</p>-->

          <!--<div class="flex flex-between base-item order-item">-->
          <!--<div class="info-box">-->
          <!--<router-link :to="{path:'/user/order_detail/'+item.order_no}">-->
          <!--<div class="flex title-box">-->
          <!--<span class="title">{{item.product.title}}</span>-->
          <!--<span class="status">{{item.status.text}}</span>-->
          <!--</div>-->
          <!--<p class="label">{{item.product.category_name}} · ¥ {{item.product.amount}}</p>-->
          <!--</router-link>-->
          <!--<hr>-->
          <!--<div class="flex btns">-->
          <!--&lt;!&ndash;<template v-if="item.status.status === 4"></template&ndash;&gt;-->
          <!--&lt;!&ndash;<a class="button white small">确认收货</a>&ndash;&gt;-->
          <!--<a class="button white small">取消提货</a>-->
          <!--<router-link :to="{path:'/user/order_express/'+item.order_no}" class="button white small">-->
          <!--查看物流-->
          <!--</router-link>-->
          <!--</div>-->
          <!--</div>-->

          <!--<div class="flex center img-box">-->
          <!--<router-link :to="{path:'/user/order_detail/'+item.order_no}">-->
          <!--<img class="img" :src="item.product.head_image.thumb">-->
          <!--</router-link>-->
          <!--</div>-->
          <!--</div>-->
          <!--</div>-->
        </template>

        <template v-if="isNoData">
          <div class="no-data">
            <img src="/static/img/user/img_default_order.png">
            <span>暂无订单</span>
          </div>
        </template>
      </div>
    </div>


    <FooterBar></FooterBar>
  </div>

</template>

<script>
  import Api from '@/config/api'
  import Tools from '@/utils/tools'
  import Http from '@/utils/http'
  import Interceptor from '@/utils/interceptor'
  import OrderStatus from './orderStatus.js'

  import LoadingPage from '@/components/LoadingPage'
  import FooterBar from '@/components/FooterBar'
  import UserHeader from './userHeader'

  export default {
    name: 'UserOrderPage',
    components: {
      FooterBar,
      UserHeader,
      LoadingPage
    },
    data() {
      return {
        loading: false,
        // 订单数据
        orders: [],
        ordersArr: [],
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

        // 先获取一下消息
        this.$store.dispatch('getNewMessage')
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
        let that = this
        this.loading = true
        this.isLoaded = false

        Http.get(Api.APIS.getUserOrders, Interceptor.httpConfig(true), {
          page: this.page,
          size: this.size
        }).then(data => {
          let temp = []
          let _data = data.data.data
          if (_data.length !== 0) {
            _data.forEach(function (v) {
              v.status = OrderStatus.getStatus(v)
              if (v.product) {
                temp.push(v)
              }
            })
          } else {
            this.isNoData = true
          }
          _data = temp
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

<style rel="stylesheet/less" lang="less" scoped>
  @import "../../style/base/variables";
  @import "../../style/components/base-list-item";

  .order-item-box {
    margin-bottom: .2rem;

    .img-box {
      flex-shrink: 0;
      .img {
        width: .72rem;
        height: .72rem;
      }
    }

    .info-box {
      padding: 0 .1rem;
      flex-grow: 1;
      overflow: hidden;
      flex-shrink: 1;
      .title {
        font-size: .16rem;
        max-width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .status-box {
        display: inline-block;
        position: relative;
        .status {
          display: inline-block;
          font-size: 0.2rem;
          transform: scale(0.5);
          transform-origin: 0 50%;
          margin-right: -50%;
          padding: 0 0.24rem;
          line-height: 0.28rem;
          height: 0.32rem;
          color: #D0B07A;
          border-radius: 0.32rem;
          border: 0.02rem solid #D0B07A;
        }
      }
      .time {
        color: #999999;
        font-size: .12rem;
      }
    }

    .amount-box {
      flex-shrink: 0;
      white-space: nowrap;
    }
  }

  .order-item {
    .btns {
      margin-top: .18rem;
      a {
        background-color: transparent;
        &:not(:last-child) {
          margin-right: .1rem;
        }
      }
    }
  }

</style>
