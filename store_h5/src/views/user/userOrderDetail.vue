<template>

  <div class="panel user-order-detail-panel tool-footer-bar">
    <LoadingPage :loading="loading"></LoadingPage>
    <div class="container">
      <header-white-bg :backPath="'/user/order'">
        <p class="flex flex-between flex-middle">
          <span>订单详情</span>
          <span class="header-status">
            {{getStatusInfo.text}}
          </span>
        </p>
      </header-white-bg>

      <!-- 物流信息 -->
      <div class="address-info space" v-if="getStatusInfo.status===4">
        <template v-if="item.logistice">
          <router-link :to="{path:'/user/order_express/'+$route.params.orderNo}">
            <div class="address-right-icon"><i class="arrow-right-icon"></i></div>
            <div class="address-info-name flex flex-start">
              <strong>运输中</strong>
            </div>
            <p class="address-info-address">{{item.logistice.last_detail}}</p>
          </router-link>
        </template>
        <template v-else>
          <p class="address-info-address">暂无物流信息</p>
        </template>
      </div>

      <!-- 地址信息 -->
      <div class="address-info space">
        <!-- <div class="address-right-icon"><i class="arrow-right-icon"></i></div> -->
        <div class="address-info-name flex flex-start">
          <strong>{{item.address.name}}</strong>
        </div>
        <div class="address-info-phone flex flex-between">
          <p>{{item.address.phone}}</p>
        </div>
        <p class="address-info-address">{{item.address.province_name}}{{item.address.city_name}}{{item.address.location}}</p>
      </div>

      <!-- 订单信息 -->
      <div class="order-list space">
        <div class="order-item-block">
          <p class="order-item-time">{{item.created_at|time}}</p>
          <div class="order-item flex flex-between">
            <div class="order-item-info">
              <div class="flex">
                <strong class="strong">{{item.product.title}}</strong>
                <div class="flex center">
                  <span class="status">1件</span>
                </div>
              </div>
              <p>{{item.product.category_name}} · ¥ {{item.product.amount}}</p>
              <div class="order-item-priec">
                ¥{{item.amount}}
              </div>
            </div>
            <div class="order-item-img">
              <img :src="item.product.head_image.thumb">
            </div>
          </div>
        </div>
      </div>


      <div class="order-info-text space">
        <p>
          <strong>订单编号</strong>
          <span>{{item.order_no}}</span>
        </p>
        <p>
          <strong>交易时间</strong>
          <span>{{item.created_at|time}}</span>
        </p>
        <p>
          <strong>支付方式</strong>
          <span>{{item.payment_type | paymentType}}</span>
        </p>
        <p>
          <strong>支付价格</strong>
          <span>¥{{item.amount}}</span>
        </p>
      </div>

      <div class="space user-order-detail-btn">
        <template v-if="getStatusInfo.status===1">
          <Button class="ui-btn" @click="pay" :loading="payBtnLoading">付款</Button>
        </template>
        <template v-if="getStatusInfo.status===4">
          <a class="ui-btn">确认收货</a>
        </template>
        <template v-if="getStatusInfo.status===5">
          <a class="ui-btn">查看退款</a>
        </template>
      </div>
    </div>

  </div>

</template>

<script>
  import Api from '@/config/api'
  import Http from '@/utils/http'
  import Interceptor from '@/utils/interceptor'
  import WxPayStart from '@/utils/pay/WxPayStart'
  import Wechat from '@/utils/pay/wechat'
  import OrderStatus from './orderStatus.js'

  import HeaderWhiteBg from '@/components/header/HeaderWhiteBg'
  import LoadingPage from '@/components/LoadingPage'
  import Button from '@/components/Button'

  export default {
    name: 'UserOrderDetailPage',
    components: {
      HeaderWhiteBg,
      LoadingPage,
      Button
    },
    data() {
      return {
        loading: false,
        payBtnLoading: false,
        item: {
          product: {
            head_image: {}
          },
          address: {},
          logistice:{
            last_detail:'',
          },
          getRoute: null
        },
        // 获取状态信息
        getStatusInfo: {}
      }
    },
    created() {
      this.init()
    },
    mounted() {
      this.getRoute = this.$route
  },
    methods: {
      init() {
        this.loading = true
        let that = this
        that.getUserOrderInfo()

        // // 获取url code
        // if (this.$route.query.code) {
        //   this.postOpenId(this.$route.query.code)
        // } else {
        //   // 先判断是否可以支付了
        //   this.hasOpenId()
        // }
      },
      // hasOpenId() {
      //   let that = this
      //   Http.get(Api.APIS.getOpenid, Interceptor.httpConfig(true)).then(data => {
      //     let _data = data.data.data
      //     if (_data !== null && _data.has_open_id) {
      //       that.getUserOrderInfo()
      //     } else {
      //       that.getWxCode()
      //     }
      //   }).catch(function (error) {
      //     that.loading = false
      //   })
      // },
      // postOpenId(code) {
      //   let that = this
      //   Http.post(Api.APIS.postOpenid, {
      //     code: code
      //   }, {
      //     headers: Interceptor.httpConfig(true)
      //   }).then(data => {
      //     let _data = data.data.data
      //     if (_data!==null && _data.has_open_id === true && _data.has_open_id !== undefined) {
      //       that.getUserOrderInfo()
      //     } else {
      //       // 重新获取code
      //       that.getWxCode()
      //     }
      //   }).catch(function (error) {
      //     that.loading = false
      //     that.getWxCode()
      //   })
      // },
      // // get has_open_id 为false 去获取code
      // getWxCode() {
      //   //重新获取code的时候都会重新拼url 去掉之前有code
      //   let redirectRri = encodeURIComponent(window.location.origin+this.getRoute.path)
      //   let authorizeUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx14c0f0c0864d30d0&redirect_uri=' + redirectRri + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'
  
      //   window.location.href = authorizeUrl
      // },
      // 获取订单信息
      getUserOrderInfo() {
        this.loading = true
        let api = Api.APIS.getUserOrderInfo.replace('$orderNo', this.$route.params.orderNo)
        Http.get(api, Interceptor.httpConfig(true)).then(data => {
          let _data = data.data.data
          this.item = _data

          this.getStatusInfo = OrderStatus.getStatus(_data)
          //未付款情况下调用微信
          if(this.getStatusInfo.status===1){
            this.wxInit()
          }
          this.loading = false
        })
      },
      wxInit(){
        // 进入微信支付流程
        WxPayStart.init({
          route: this.$route,
          loading: this.loading
        }, function () {
          
        })
      },
      // 支付
      pay() {
        let that = this
        that.payBtnLoading = true
        let orderNo = this.$route.params.orderNo
        let api = Api.APIS.postOrdersPay.replace('$orderNo', orderNo)
        Http.post(api, {
          'payment_type': 'wxpay'
        }, {
          headers: Interceptor.httpConfig(true)
        }).then(data => {
          let _data = data.data.data
          const redirectUrl = {
            success: '/buy/pay_success/' + orderNo,
            fail: '/user/order_detail/' + orderNo
          }
          // 微信支付
          let _Wechat = new Wechat(that)
          _Wechat.payWeChat(_data, redirectUrl, function () {
            that.payBtnLoading = false
          })
        })
      }
    }
  }
</script>

<style rel="stylesheet/less" lang="less" scoped>
  .user-order-detail-panel {

    .header-status {
      font-size: 14px;
      color: #fff;
      background-color: #D0B07A;
      border-radius: 18px;
      padding: 0 .2rem;
      line-height: .32rem;
      height: .32rem;
    }
    .order-info-text {
      margin: 20px 0;
      p {
        color: #000;
        font-size: 14px;
        margin-bottom: 20px;
        strong {
          font-weight: 500;
          margin-right: 20px;
        }
        span {
          font-weight: 300;
        }
      }
    }
    .user-order-detail-btn {
      margin-bottom: 20px;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      .ui-btn {
        display: block;
        width: 100%;
      }
    }
  }
</style>
