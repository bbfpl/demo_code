<i18n src="./lang.json"></i18n>

<template>
  <div>
    <header-white-bg :showBarArr="['close']" :closePath="'/balance'">提现成功</header-white-bg>
    <p class="explain">
      您已将 ￥{{ amount }} 提现至您的银行卡，请注意查收！
    </p>
    <div class="bank-card-info">
      <p class="bank-name">{{ bankCard.name }}</p>
      <p class="other-info">
        <span>{{ bankCard.holder }}</span>&nbsp;·&nbsp;<span>{{ bankCard.no }}</span>
      </p>
    </div>
  </div>
</template>

<script>
  import Http from '@/utils/http'
  import Api from '@/config/api'
  import Interceptor from '@/utils/interceptor'

  import HeaderWhiteBg from '../../components/header/HeaderWhiteBg'

  export default {
    name: 'WithdrawSuccess',
    components: {HeaderWhiteBg},
    data() {
      return {
        amount: 0,
        bankCard: {
          'no': '',
          'holder': '',
          'code': '',
          'name': ''
        }
      }
    },
    created() {
      this.amount = this.$route.query.amount
      this.getUserBankCard()
    },
    methods: {
      getUserBankCard() {
        Http.get(Api.APIS.getBankCard, Interceptor.httpConfig(true)).then((response) => {
          let res = response.data.data
          const cardNoLength = res.no.length
          res.no = res.no.substring(0, 4) + ' **** **** ' + res.no.substring(cardNoLength - 4, cardNoLength)
          this.bankCard = res
        })
      }
    }
  }
</script>

<style rel="stylesheet/less" lang="less" scoped>

  .explain {
    font-size: .14rem;
    line-height: .24rem;
    margin: 0 .2rem;
  }
  .bank-card-info {
    background: #F7F7F7;
    margin: .2rem;
    padding: .2rem;
    .bank-name {
      font-size: .16rem;
      line-height: .16rem;
      font-weight: 700;
      margin-bottom: .08rem;
    }
    .other-info {
      font-size: .12rem;
      color: #999999;
      line-height: .12rem;
    }
  }
</style>