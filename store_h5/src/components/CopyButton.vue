<template>
	<a class="btn" :data-clipboard-text="copyText">
		<slot></slot>
	</a>
</template>
<script>
import Clipboard from 'clipboard';
export default{
  props: {
    'text': {
      type: String,
      default: ''
    }
  },
  data(){
    return {
      copyText:this.text
    }
  },
  watch: {
    text(){
      this.copyText = this.text;
    }
  },
  mounted(){
    let _self = this;
    let clipboard = new Clipboard('.btn');
    clipboard.on('success', function(e) {
      // console.info('Action:', e.action);
      // console.info('Text:', e.text);
      // console.info('Trigger:', e.trigger);
      // alert('复制成功');
      _self.$store.dispatch('pushNotification', {notice: '复制成功', type: 'notice'})
      e.clearSelection();
    });

    clipboard.on('error', function(e) {
      // console.error('Action:', e.action);
      // console.error('Trigger:', e.trigger);
      _self.$store.dispatch('pushNotification', {notice: '复制失败请重新复制', type: 'notice'})
      console.error('copy error');
    });
  },
  methods: {
    
  }
}
</script>

<style scoped>
  
</style>