<template>
  <a class="icon icon-back black position-relative" href="javascript:;" @click="back"></a>
</template>

<script>
  export default {
    name: 'BackButton',
    props: {
      'path': {
        type: String,
        default: ''
      },
      'push': {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {}
    },
    created() {

    },
    methods: {
      back() {
        if (this.path !== '') {
          let reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g
          if (reg.test(this.path)) {
            window.location.href = this.path
          } else {
            if (this.push) {
              this.$router.push({path: this.path})
            } else {
              window.location.href = window.location.origin + this.path
            }
          }
        } else {
          if (window.history.length <= 1) {
            this.$router.push({path: '/'})
            return false
          } else {
            this.$router.go(-1)
          }
        }
      }
    }
  }
</script>
