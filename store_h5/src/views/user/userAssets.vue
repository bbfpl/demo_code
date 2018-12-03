<i18n src="./userAssets.json"></i18n>

<template>

  <div class="panel user-assets-panel tool-footer-bar">
    <loading-page :loading="loading"></loading-page>
    <UserHeader></UserHeader>

    <div class="container">
      <!--账户余额-->
      <router-link to="/balance" class="flex flex-between account-balance">
        <div class="">
          <p class="title">账户余额</p>
          <p class="price">￥{{ balance }}</p>
        </div>
        <p class="flex center">
          <i class="icon-arrow-right"></i>
        </p>
      </router-link>

      <!-- 熊猫列表 -->
      <div class="space base-list" v-if="pandaList.length > 0">
        <div class="flex flex-between base-item panda" @click="toPanda(item.panda.uuid)" v-for="(item, index) in pandaList"
             :key="index">
          <div class="info-box">
            <p class="flex title-box">
              <span class="title">Panda #{{ item.panda.id }}</span>
              <span class="sex boy" v-if="item.panda.gender === 'f'"></span>
              <span class="sex girl" v-else></span>
              <span class="status" v-if="item.panda.state !== 'None'">{{ $t(item.panda.state) }}</span>
            </p>
            <p class="label">{{ item.panda.category_name }}</p>
            <p class="flex tags">
              <span v-for="tag in item.panda.gene_tags">{{ tag }}</span>
            </p>
          </div>
          <div class="flex center img-box">
            <img class="img" :src="item.panda.panda.thumb">
          </div>
        </div>
      </div>

      <!-- token饰品列表 -->
      <div class="space base-list" v-if="jewelryList">
        <div class="flex flex-between base-item accessory" @click="toJewelry(item.product.uuid)" v-for="(item, index) in jewelryList" :key="index">
          <div class="info-box">
            <p class="flex title-box">
              <span class="title">{{ item.product.title }}</span>
              <span class="status">{{ item.stateName }}</span>
            </p>
            <p class="label">{{ item.product.category_name }}</p>
            <hr>
            <p class="describe">{{ item.product.sub_title }}</p>
          </div>
          <div class="flex center img-box">
            <img class="img" :src="item.product.head_image.thumb">
          </div>
        </div>
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

  import LoadingPage from '@/components/LoadingPage'
  import FooterBar from '@/components/FooterBar'
  import UserHeader from './userHeader'

  export default {
    name: 'UserAssetsPage',
    components: {
      LoadingPage,
      UserHeader,
      FooterBar,
    },
    data() {
      return {
        loading: true,
        // 数据
        list: [],
        // 分页-当前页数
        page: 1,
        // 分页-每页多少条数据
        size: 10,
        // 加载完成
        isLoaded: true,
        // 是否可以滚动
        isScroll: true,
        balance: 0,
        pandaList: '',
        jewelryList: ''
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
        this.getUserAssets()
        this.getBalance()
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
          this.getUserAssets()
        }
      },
      getBalance() {
        Http.get(Api.APIS.getBalance, Interceptor.httpConfig(true)).then((res) => {
          this.balance = res.data.data.wallet
        }).catch((error) => {
          console.log('error', error)
        })
      },
      getUserAssets() {
        let that = this
        this.loading = true
        this.isLoaded = false
        Http.get(Api.APIS.getUserAssets, Interceptor.httpConfig(true), {
          page: this.page,
          size: this.size
        }).then(data => {
          let allAssetsArr = data.data.data
          const pandaList = allAssetsArr.filter(item => item.entity.toLowerCase() === 'panda')
          const jewelryList = allAssetsArr.filter(item => item.entity.toLowerCase() === 'product')

          if (allAssetsArr.length !== 0) {
            allAssetsArr.forEach(function (v) {
              v.stateName = v.state === 'None' ? '未上链' : '已上链'
            })
          }

          // 如果数据小于10条没有更多数据
          if (allAssetsArr.length < 11) {
            this.isScroll = false
          }

          this.list = this.list.concat(allAssetsArr.slice(0, 10))
          this.pandaList = pandaList
          this.jewelryList = jewelryList
          this.isLoaded = true
          this.loading = false
        }).catch(function (error) {
          console.log('error', error)
          that.loading = false
        })
      },
      toPanda(id) {
        this.$router.push({path: '/panda_detail/' + id})
      },
      toJewelry(id) {
        this.$router.push({path: '/detail/' + id})
      }
    }
  }
</script>

<style rel="stylesheet/less" lang="less" scoped>
  @import "../../style/base/variables";
  @import "../../style/components/base-list-item";

  .account-balance {
    background: #F7F7F7;
    padding: .2rem;
    margin: 0 .2rem .2rem .2rem;
    .title {
      font-size: .28rem;
      line-height: .28rem;
      margin-bottom: .08rem;
    }
    .price {
      color: #666666;
      font-size: .12rem;
      line-height: .12rem;
    }
  }

</style>
