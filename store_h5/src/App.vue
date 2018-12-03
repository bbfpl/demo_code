<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import webStorage from './utils/webStorage'

  export default {
    name: 'App',
    created() {
      this.updateLoginStatus()
    },
    methods: {
      updateLoginStatus() {
        let token = webStorage.getUnExpiredVal('token')
        // console.log(token);
        if (token) {
          this.$store.dispatch('getUser')
          //   let that = this
          //   this.$store.dispatch('refreshToken').then((res) => {
          //     setInterval(function () {
          //       that.$store.dispatch('refreshToken')
          //     }, 3600000)
          //   })
        } else {
          this.$store.dispatch('signOut')
        }
      }
    }
  }
</script>
