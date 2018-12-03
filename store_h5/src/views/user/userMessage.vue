<template>

  <div class="panel user-message-panel tool-footer-bar">
    <LoadingPage :loading="loading"></LoadingPage>

    <UserHeader></UserHeader>

    <div class="container">
      <!-- 消息列表 -->
      <div class="user-message-list space">
        <template v-if="data.length > 0">
          <div class="user-message-item" v-for="(item,index) in data">
            <a :href="item.link">
              <p class="time-and-label">{{item.created_at|time}} · <span class="label">繁殖</span></p>
              <div class="flex flex-between user-message-item-block">
                <p>{{item.content}}</p>
                <!--<p class="flex center"><i class="arrow-right-icon"></i></p>-->
              </div>
            </a>

          </div>
        </template>

        <template v-if="isNoData">
          <div class="no-data">
            <img src="/static/img/user/img_default_notice.png">
            <span>暂无消息</span>
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
  import webStorage from '@/utils/webStorage'

  import LoadingPage from '@/components/LoadingPage'
  import FooterBar from '@/components/FooterBar'
  import UserHeader from './userHeader'

  export default {
    name: 'UserMessagePage',
    components: {
      FooterBar,
      UserHeader,
      LoadingPage
    },
    data() {
      return {
        loading: false,
        maxId: 0,
        data: [],
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
    mounted() {

    },
    beforeDestroy() {
      Tools.listener.removeListener('scroll', this.scrollLoading)
    },
    methods: {
      init() {
        this.getUserMessages()
        Tools.listener.addListener('scroll', this.scrollLoading)
      },
      scrollLoading() {
        let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        let innerHeight = window.innerHeight
        let scrollH = document.body.scrollHeight - 200
        if (scrollTop + innerHeight >= scrollH && this.isScroll === true && this.isLoaded === true) {
          this.page++
          this.getUserMessages()
        }
      },
      // 获取消息
      getUserMessages() {
        this.loading = true
        this.isLoaded = false

        let api = Api.APIS.getUserMessages
        Http.get(api, Interceptor.httpConfig(true), {
          page: this.page,
          size: this.size
        }).then(data => {
          let _data = data.data.data
          if (_data.length > 0) {
            // 保存最大id
            webStorage.set('msg_max_id', _data[0]['id'])
          }

          if (_data.length <= 0) {
            this.isNoData = true
          }
          // 如果数据小于10条没有更多数据
          if (_data.length < this.size + 1) {
            this.isScroll = false
          }

          this.data = this.data.concat(_data.slice(0, this.size))
          this.isLoaded = true
          this.loading = false
        })
      }
    }
  }
</script>

<style rel="stylesheet/less" lang="less" scoped>
  .user-message-panel {
    .user-message-item {
      margin-bottom: 20px;
      .time-and-label {
        font-size: 12px;
        line-height: .18rem;
        color: #999;
        margin-bottom: .06rem;
        .label {
          color: #D0B07A;
          font-weight: 400;
        }
      }
      .user-message-item-block {
        background-color: rgba(0, 0, 0, .03);
        padding: 16px 20px;
        p {
          font-weight: 400;
          font-size: 14px;
          color: #000;
        }
      }
    }
  }
</style>
