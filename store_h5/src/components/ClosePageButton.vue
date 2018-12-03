<template>
  <a class="icon icon-close" href="javascript:;" @click="closePage"></a>
</template>

<script>
  export default {
    name: 'ClosePageButton',
    props: {
      'path': {
        type: String,
        default: ''
      }
    },
    data() {
      return {}
    },
    created() {

    },
    methods: {
      closePage() {
        if (this.path !== '') {
          let reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g
          if (reg.test(this.path)) {
            window.location.href = this.path
          } else {
            this.$router.replace({path: this.path})
          }
        } else {
          this.$router.replace({path: '/'})
        }
      }
    }
  }
</script>
