<i18n src="./lang.json"></i18n>

<template>
  <div>
    <notification></notification>
    <header-white-bg :path="'/balance'">{{ $t('withdraw') }}</header-white-bg>

    <div class="content">
      <p class="little-title">转账到银行</p>

      <div class="flex flex-between account-box">
        <template v-if="noBankCard">
          <div class="no-bank-card">
            请添加银行卡
          </div>
          <div class="flex center">
            <router-link to="/edit-bank-card">
              <button class="btn">添加</button>
            </router-link>
          </div>
        </template>
        <template v-if="!noBankCard && !initing">
          <div class="info">
            <p class="bank">{{ bankCard.name }}</p>
            <p class="account">{{ bankCard.holder }} <span>·</span> {{ bankCard.no }}</p>
          </div>
          <div class="flex center">
            <router-link to="/edit-bank-card">
              <button class="btn">编辑</button>
            </router-link>
          </div>
        </template>
      </div>

      <p class="withdraw-amount">提现金额</p>
      <p class="input-box">
        <span class="currency">￥</span>
        <input type="number"
               v-model="form.amount"
               :class="[{'active' : isFocus.amount}, 'input']"
               @focus="changeInputFocus('amount', true)" @blur="changeInputFocus('amount', false)">
      </p>

      <p class="balance">
        账户余额 ￥{{ balance }} ,&nbsp;&nbsp;<span class="withdraw-all" @click="withdrawAll">全部提现</span>
      </p>
    </div>

    <p class="text-center tips">
      请留意银行到账时间
    </p>

    <p :class="[{'move-up-submit' : moveUpSubmit}, 'submit-box']">
      <button class="submit" @click="withdraw" :disabled="disabledSubmit">
        确定
      </button>
    </p>
  </div>
</template>

<script>
  import Http from '@/utils/http'
  import Api from '@/config/api'
  import Interceptor from '@/utils/interceptor'

  import Notification from '../../components/notification/Notification'
  import HeaderWhiteBg from '../../components/header/HeaderWhiteBg'

  export default {
    name: 'Withdraw',
    components: {
      Notification,
      HeaderWhiteBg
    },
    data() {
      return {
        balance: '',
        noBankCard: false,
        form: {
          amount: ''
        },
        isFocus: {
          amount: false
        },
        moveUpSubmit: false,
        initing: true,
        loading: false,
        bankCard: {
          'no': '',
          'holder': '',
          'code': '',
          'name': ''
        }
      }
    },
    computed: {
      currentLang() {
        return this.$store.state.currentLang
      },
      disabledSubmit() {
        return this.loading || !this.form.amount || this.initing
      }
    },
    created() {
      this.getBalance()
      this.getUserBankCard()
    },
    methods: {
      getBalance() {
        Http.get(Api.APIS.getBalance, Interceptor.httpConfig(true)).then((res) => {
          this.balance = res.data.data.wallet
          this.initing = false
        }).catch((error) => {
          console.log('error', error)
          this.initing = false
        })
      },
      changeInputFocus(inputName, isFocus) {
        this.moveUpSubmit = isFocus
        this.isFocus[inputName] = isFocus
      },
      getUserBankCard() {
        Http.get(Api.APIS.getBankCard, Interceptor.httpConfig(true)).then((response) => {
          console.log('response', response)
          if (!response.data.data) {
            this.noBankCard = true
            return
          }
          let res = response.data.data
          const cardNoLength = res.no.length

          res.no = res.no.substring(0, 4) + ' **** **** ' + res.no.substring(cardNoLength - 4, cardNoLength)
          this.bankCard = res
        })
      },
      withdrawAll() {
        this.form.amount = this.balance
      },
      withdraw() {
        if (this.loading) {
          return
        }
        this.loading = true

        if (this.form.amount > this.balance) {
          this.$store.dispatch('pushNotification', {notice: '没有足够的余额'})
          this.loading = false
          return
        }

        const params = {
          amount: this.form.amount,
          type: 'bank'
        }
        Http.post(Api.APIS.postWithdraw, params, {
          headers: Interceptor.httpConfig(true)
        }).then((res) => {
          if (res.data.meta.msg) {
            this.$store.dispatch('pushNotification', {notice: res.data.meta.msg[this.currentLang]})
          } else {
            this.$router.replace({path: '/withdraw/success', query: { amount: this.form.amount }})
          }
          this.loading = false
        }).catch((error) => {
          this.$store.dispatch('pushNotification', {notice: error.response.data.meta.msg.cn})
          this.loading = false
        })
      }
    }
  }
</script>

<style rel="stylesheet/less" lang="less" scoped>
  @import "./withdraw";
</style>

