<template>
  <div :class="className" @click="changeBtnStatus">
    test
    <span class="ellipse"></span>
    <span class="vertical-line" v-show="active"></span>
    <span class="circle"></span>
  </div>
</template>

<script>
  export default {
    name: 'SwitchBtn',
    data() {
      return {
        active: false,
        defaultClass: true
      }
    },
    computed: {
      className() {
        if (this.defaultClass) {
          return 'defaultClass'
        } else {
          return this.active ? 'active' : 'disabled'
        }
      }
    },
    methods: {
      changeBtnStatus() {
        this.$emit('click', this.active)
        if (this.defaultClass) {
          this.defaultClass = false
        }
        this.active = !this.active
      }
    }
  }
</script>

<style rel="stylesheet/less" lang="less" scoped>
  .active .circle {
    animation: circleFade 0.5s;
  }

  .disabled .circle {
    animation: disabledCircleFade 0.5s;
  }

  @keyframes circleFade {
    from {
      left: 0;
    }
    to {
      left: .18rem;
    }
  }

  @keyframes disabledCircleFade {
    from {
      left: .18rem;
    }
    to {
      left: 0;
    }
  }

  .disabled, .defaultClass, .active {
    position: relative;
    display: inline-block;
    width: .42rem;
    height: .24rem;
  }

  .ellipse {
    display: inline-block;
    position: absolute;
    width: .4rem;
    height: .18rem;
    border-radius: .1rem;
    left: 0;
    top: .03rem;
  }

  .circle {
    position: absolute;
    display: inline-block;
    width: .24rem;
    height: .24rem;
    border-radius: 50%;
    top: 0;
  }

  .disabled, .defaultClass {
    .ellipse {
      background: #EEEEEE;
    }
    .circle {
      background: #CCCCCC;
      left: 0;
    }
  }

  .active {
    .ellipse {
      background: #000000;
    }
    .vertical-line {
      position: absolute;
      display: inline-block;
      background: #D0B07A;
      width: .02rem;
      height: .06rem;
      border-radius: .01rem;
      left: .08rem;
      top: .09rem;
    }
    .circle {
      background: #D0B07A;
      left: .18rem;
      top: 0;
    }
  }

</style>