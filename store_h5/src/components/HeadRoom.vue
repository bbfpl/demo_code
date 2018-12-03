<template>
  <headroom :speed="350">
    <slot></slot>
  </headroom>
</template>
<script>
  import {headroom} from 'vue-headroom'

  export default {
    name: 'HeadRoom',
    props: {
      path: String,
      default: ''
    },
    components: {
      headroom
    },
    data() {
      return {}
    },
    created() {

    },
    methods: {}
  }
</script>
