<template>

  <div class="panel user-home-panel tool-footer-bar">
    <UserHeader></UserHeader>

    <div class="container">
      <!-- 熊猫列表 -->
      <div class="panda-list space">

        <div class="panda-item" @click="toPanda('1')">
          <div class="panda-item-conten">
            <!-- 名称和性别 -->
            <div class="flex">
              <p class="title">Panda #68</p>
              <div class="flex center"><i class="boy"></i></div>
            </div>
            <p class="label">2018 天使熊猫</p>
            <!-- 标签 -->
            <div class="tags">
              <span>红色</span>
              <span>运动系</span>
              <span>水瓶座</span>
              <span>唱歌</span>
            </div>
            <!-- 图片 -->
            <div class="panda-list-item-img"><img src="/static/img/panda/panda-1.png"></div>
          </div>
        </div>
        <div class="panda-item" @click="toPanda('1')">
          <div class="panda-item-conten">
            <!-- 名称和性别 -->
            <div class="flex">
              <p class="title">Panda #68</p>
              <div class="flex center"><i class="boy"></i></div>
            </div>
            <p class="label">2018 天使熊猫</p>
            <!-- 标签 -->
            <div class="tags">
              <span>红色</span>
              <span>运动系</span>
              <span>水瓶座</span>
              <span>唱歌</span>
            </div>
            <!-- 图片 -->
            <div class="panda-list-item-img"><img src="/static/img/panda/panda-1.png"></div>
          </div>
        </div>
        <div class="panda-item" @click="toPanda('1')">
          <div class="panda-item-conten">
            <!-- 名称和性别 -->
            <div class="flex">
              <p class="title">Panda #68</p>
              <div class="flex center"><i class="boy"></i></div>
            </div>
            <p class="label">2018 天使熊猫</p>
            <!-- 标签 -->
            <div class="tags">
              <span>红色</span>
              <span>运动系</span>
              <span>水瓶座</span>
              <span>唱歌</span>
            </div>
            <!-- 图片 -->
            <div class="panda-list-item-img"><img src="/static/img/panda/panda-1.png"></div>
          </div>
        </div>
        <div class="panda-item" @click="toPanda('1')">
          <div class="panda-item-conten">
            <!-- 名称和性别 -->
            <div class="flex">
              <p class="title">Panda #68</p>
              <div class="flex center"><i class="boy"></i></div>
            </div>
            <p class="label">2018 天使熊猫</p>
            <!-- 标签 -->
            <div class="tags">
              <span>红色</span>
              <span>运动系</span>
              <span>水瓶座</span>
              <span>唱歌</span>
            </div>
            <!-- 图片 -->
            <div class="panda-list-item-img"><img src="/static/img/panda/panda-1.png"></div>
          </div>
        </div>

      </div>
    </div>


    <FooterBar></FooterBar>
  </div>

</template>

<script>
  import FooterBar from '@/components/FooterBar'
  import UserHeader from './userHeader'
  export default {
    name: 'UserPandaPage',
    components: {
      FooterBar,
      UserHeader
    },
    data() {
      return {

      }
    },
    created() {
  
    },
    mounted() {
  
    },
    methods: {
      toPanda(id) {
        this.$router.push({path: '/panda_detail/' + id})
      }
    }
  }
</script>
