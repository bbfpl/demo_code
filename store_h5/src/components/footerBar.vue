<template>
    <div class="footer-bar-block">
        <div class="footer-bar flex flex-between">
            <div class="footer-bar-item flex direction-column"  
                :class="{'footer-bar-item-active': isActive(item.name)}" 
                v-for="(item,index) in nav" :key="index" 
                @click="handelFooterBarClick(item,index)">
                <span class="flex center"><i :class="item.name"></i></span>
                <p class="text-center">{{item.text}}</p>
            </div>
        </div>
    </div>
</template>
<script>

export default {
  name: 'FooterBar',
  data() {
    return {
      nav: [
        {
          name: 'home',
          text: '首页'
        },
        {
          name: 'explore', // limited edition
          text: '探索'
        },
        {
          name: 'user',
          text: '我的'
        }
      ]
    }
  },
  created() {
    // console.log(this.$route);
  },
  methods: {
    isActive(name) {
      if (this.$route.path.indexOf(name) !== -1) {
        return true
      } else {
        return false
      }
    },
    handelFooterBarClick(e, i) {
      // console.log(e);
      this.$router.push({ name: e.name })
    }
  }
}
</script>
<!-- <style lang="less" scoped>

</style> -->