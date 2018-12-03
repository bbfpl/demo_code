
<template>
  <transition name="bounceUp">
    <div class="buy-pay-panel" v-if="showPayPanel">
      <div class="container">
        <div class="bpp-body">
          <div class="header-toolbar position-absolute">
            <a class="close-icon" href="javascript:;" @click="closePayPanel"></a>
          </div>
          <h1 class="space">支付</h1>

          <div class="form-group space">
            <div v-for="(item,index) in pays" class="pay-radio">
              <label class="form-radio">
                  <input type="radio" name="pay_type" :value="item.id"  v-model="getPayType">
                  <span>
                    <i class="form-icon"></i>
                  </span>
                  <p class="pay-icon flex">
                    <i :class="item.icon"></i>
                    <span>{{item.name}}</span>
                  </p>
              </label>
            </div>
          </div>
          <div class="buy-pay-bottom flex space">
            <Button class="ui-btn" :loading="payBtnLoading"  @click="pay">确定</Button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Button from '@/components/Button'
  export default {
    name: 'PayPanel',
    props: {
      'payBtnLoading': {
        type: Boolean,
        default: false
      },
      'showPayPanel': {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        getPayType: 'wxpay',
        pays: [
          // {
          //   id: 'alipay',
          //   icon: 'icon-alipay',
          //   name: 'Alipay'
          // },
          // {
          //   id: 'applepay',
          //   icon: 'icon-applepay',
          //   name: 'Apple Pay'
          // },
          // {
          //   id: 'googlepay',
          //   icon: 'icon-googlepay',
          //   name: 'Google Pay'
          // },
          // {
          //   id: 'paypal',
          //   icon: 'icon-paypal',
          //   name: 'PayPal'
          // }
          {
            id: 'userpay',
            icon: 'icon-userpay',
            name: '账号余额'
          },
          {
            id: 'wxpay',
            icon: 'icon-wechatpay',
            name: 'WeChat Pay'
          }
        ],
      }
    },
    created() {

    },
    methods: {
      //关闭支付弹窗
      closePayPanel() {
        this.showPayPanel = false;
        this.payBtnLoading = false;
        this.$emit('closePanel');
      },
      pay(){
        this.$emit('pay',this.getPayType);
      }
    }
  }
</script>
<style rel="stylesheet/less" lang="less" scoped>
  .ui-btn{
    width: 100%;
  }
  .header-toolbar {
    right: 0;
    top: -10px;
  }
</style>
