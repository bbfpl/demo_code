<template>
  <button class="ui-button" @click="handleClick" :disabled="loading">
    <i class="ui-icon-loading" v-if="loading"></i>
    <template v-else>
      <slot></slot>
    </template>
  </button>
</template>
<script>
  export default{
    name: 'Button',
    props: {
      loading: Boolean,
      default: false
    },
    data() {
      return {}
    },
    methods: {
      handleClick(evt) {
        this.$emit('click', evt)
      }
    }
  }
</script>
<style scope>

</style>