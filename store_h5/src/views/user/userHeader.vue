<template>

  <div>
    <notification></notification>
    <!-- 头部黑色背景 -->
    <div class="header-bg">
      <div class="shade"></div>
      <img :src="avatar">
    </div>

    <div class="container">

      <div class="header-toolbar flex flex-end">
        <router-link class="icon icon-setting position-relative" :to="{path: '/setting'}"></router-link>
      </div>
      <h1 class="username">{{ userName }}</h1>
      <p class="wallet-box">
        <CopyButton :text="userWallet" class="copy-box" v-if="userWallet">
          <span class="wallet">钱包地址: {{ userWallet }}</span>
          <img src="/static/img/public/icon-copy@3x.png">
        </CopyButton>
      </p>


      <nav class="flex">
        <template v-for="(item,index) in nav">
          <router-link :to="{path:'/user/'+item.type}" :class="{'active': $route.name == item.type}">
            {{item.name}}
            <template v-if="item.type === 'message' && isNew === true">
              <i class="msg-new"></i>
            </template>
          </router-link>
        </template>
      </nav>

    </div>
  </div>

</template>

<script>
  import Notification from '@/components/notification/Notification'
  import CopyButton from '@/components/CopyButton'

  export default {
    name: 'UserHeaderModel',
    components: {
      Notification,
      CopyButton
    },
    data() {
      return {
        isNew: false,
        nav: [
          // {
          //   id: 0,
          //   type: 'panda',
          //   name: '熊猫'
          // },
          {
            id: 1,
            type: 'assets',
            name: '资产'
          },
          {
            id: 2,
            type: 'order',
            name: '账单'
          },
          {
            id: 3,
            type: 'message',
            name: '消息'
          }
        ]
      }
    },
    computed: {
      avatar() {
        return this.$store.state.user.avatar || '/static/img/user/bobby-user.jpg'
      },
      userName() {
        return this.$store.state.user.nickname
      },
      userWallet() {
        return this.$store.state.user.wallet
      }
    },
    created() {

    },
    mounted() {
      this.isNew = this.$store.state.message.isNew
    },
    methods: {}
  }
</script>

<style rel="stylesheet/less" lang="less" scoped>
  .header-bg {
    .shade {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .4);
      z-index: 2;
    }
    img {
      width: 100%;
      position: relative;
      top: -10%;
      z-index: 1;
    }
  }

  .username {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 0 .2rem;
    margin-top: calc(1.6rem - .44rem - .46rem - .14rem - .2rem);
    font-size: .32rem;
    line-height: .46rem;
    color: #fff;
    letter-spacing: 0;
  }

  .wallet-box {
    height: .14rem;
    margin-bottom: .2rem;
  }

  .copy-box {
    display: inline-block;
    color: #fff;
    font-size: .2rem;
    line-height: .28rem;
    transform: scale(0.5);
    transform-origin: .4rem 0;
    margin-right: -50%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: calc((100% - .4rem) * 2);
    img {
      display: inline-block;
      vertical-align: middle;
      width: .2rem;
      height: .2rem;
      margin-left: .1rem;
    }
  }

  nav {
    padding: 20px;
    a {
      font-size: 20px;
      color: #ccc;
      margin-right: 48px;
      font-weight: 500;
      position: relative;
      &.active {
        color: #000;
        &:after {
          content: " ";
          width: 20px;
          height: 2px;
          background-color: #D0B07A;
          display: block;
        }
      }
    }

    .msg-new {
      width: 10px;
      height: 10px;
      position: absolute;
      background-color: red;
      right: -3px;
      top: -3px;
      border-radius: 50%;
    }
  }
</style>
