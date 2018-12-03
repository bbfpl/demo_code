<template>
  <div class="text-center content-box">
    <p><img src="/static/img/welcome/panda@3x.png" alt="Welcome" class="panda"></p>
    <p><img src="/static/img/welcome/panda-earth@3x.png" alt="PandaEarth" class="panda-earth"></p>
    <p><span>{{ $t('slogan') }}</span>{{ $t('sloganLastChar') }}</p>
  </div>
</template>

<script>
 export default {
   name: 'Welcome'
 }
</script>

<style rel="stylesheet/less" lang="less" scoped>
  .content-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      &.panda {
        width: .87rem;
        margin: 0 0 .27rem 0;
      }
      &.panda-earth {
        width: 1.96rem;
        margin: 0 0 .5rem 0;
      }
    }
    p {
      width: 2.42rem;
      span {
        letter-spacing: .1rem;
      }
    }
  }
</style>