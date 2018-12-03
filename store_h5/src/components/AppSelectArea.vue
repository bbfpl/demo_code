<template>
  <div>
    <transition name="modal-bg">
      <div class="modal-bg" @click="close" v-show="show"></div>
    </transition>

    <transition name="content">
      <div class="select-area" @click.stop v-show="show">
        <p class="little-title-box">
          <span class="little-title">选择区域</span>
          <button class="pull-right sure-btn"
                  :disabled="disabledSubmit"
                  @click="setAreaInfo">确定
          </button>
        </p>
        <p class="current-address">
          <span :class="{'show-current-list': showList.province}"
                @click="showProvincesList">{{ currentProvince.name }}</span>
          <span :class="{'show-current-list': showList.city}" @click="showCitiesList">{{ currentCity.name }}</span>
        </p>
        <hr>
        <div class="list" v-show="showList.province">
          <template v-for="(province, index) in location">
            <p :class="['component-list-item', {'selected-list-item': currentProvince.code === province.code}]"
               @click="selectProvince(province, index)">
              <span>{{ province.name }}</span>
              <i class="pull-right icon-selected"></i>
            </p>
          </template>
        </div>
        <div class="list" v-show="showList.city">
          <template v-for="city in location[currentProvinceIndex].children">
            <p :class="['component-list-item', {'selected-list-item': city.code === currentCity.code}]"
               @click="selectCity(city)">
              <span>{{ city.name }}</span>
              <i class="pull-right icon-selected"></i>
            </p>
          </template>
        </div>
      </div>
    </transition>

  </div>

</template>

<script>
  import api from '@/config/api'
  import http from '@/utils/http'
  import Interceptor from '@/utils/interceptor'

  export default {
    name: 'SelectArea',
    data() {
      return {
        location: [
          {
            code: '',
            name: '',
            children: [
              {
                code: '',
                name: ''
              }
            ]
          }
        ],
        showList: {
          province: true,
          city: false
        },
        currentProvinceIndex: 0,
        currentProvince: {
          code: '',
          name: '省'
        },
        currentCity: {
          code: '',
          name: '市'
        }
      }
    },
    mounted() {
      this.$store.commit('RESET_AREA_INFO')
      this.getLocation()
      if (this.initProvince.name) {
        this.currentProvince = this.initProvince
      }
      if (this.initCity.name) {
        this.currentCity = this.initCity
      }
    },
    computed: {
      show() {
        return this.$store.state.appSelectArea.show
      },
      disabledSubmit() {
        return this.currentProvince.code === '' || this.currentCity.code === ''
      },
      initProvince() {
        return this.$store.state.appSelectArea.province
      },
      initCity() {
        return this.$store.state.appSelectArea.city
      }
    },
    methods: {
      getLocation(state) {
        http.get(api.APIS.getLocation, Interceptor.httpConfig(true)).then((res) => {
          this.location = res.data.data
        })
      },
      showProvincesList() {
        this.showList.province = true
        this.showList.city = false
      },
      showCitiesList() {
        this.showList.city = true
        this.showList.province = false
      },
      selectProvince(province, index) {
        this.currentProvince = province
        this.currentProvinceIndex = index
        this.currentCity = {
          code: '',
          name: '市'
        }
        this.showCitiesList()
      },
      selectCity(city) {
        this.currentCity = city
      },
      close() {
        this.$store.commit('SET_SHOW_SELECT_AREA_STATUS', false)
      },
      setAreaInfo() {
        this.$store.commit('SET_AREA_INFO', {
          province: this.currentProvince,
          city: this.currentCity
        })
        this.close()
      }
    }
  }
</script>

<style rel="stylesheet/less" lang="less" scoped>
  @import '../style/base/variables';
  /*@import '../style/components/base-button';*/

  .modal-bg-enter-active {
    animation: modal-in 1s;
  }

  .modal-bg-leave-active {
    animation: modal-in 1s reverse;
  }

  @keyframes modal-in {
    0% {
      opacity: 0;
    }
    60% {
      opacity: .8;
    }
  }

  .content-enter-active {
    animation: contentIn 1s;
  }

  .content-leave-active {
    animation: contentOut 1s;
  }

  @keyframes contentIn {
    from, 60%, 75%, 90%, to {
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    0% {
      transform: translateY(3000px);
      opacity: 0;
    }
    60% {
      opacity: 1;
      transform: translateY(-20px);
    }
    75% {
      transform: translateY(10px);
    }
    90% {
      transform: translateY(-5px);
    }
    100% {
      transform: translateY(0);
    }
  }

  @-webkit-keyframes contentOut {
    20% {
      transform: translateY(-10px);
    }
    40%, 45% {
      transform: translateY(20px);
    }
    to {
      transform: translateY(100%);
    }
  }

  .modal-bg {
    width: 100%;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 100vh;
    background: @base-white;
    opacity: .8;
    z-index: 1;
  }

  .select-area {
    z-index: 100;
    box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.03);
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: .4rem .2rem;
    background: @base-white;
    opacity: 1;
  }

  .little-title-box {
    margin-bottom: .2rem;
    .little-title {
      font-size: .24rem;
      margin-bottom: .3rem;
      font-weight: bolder;
    }

    .sure-btn {
      height: .32rem;
      line-height: .32rem;
      font-size: .14rem;
      border-radius: .24rem;
      outline: none;
      border: 2px solid @base-black;
      &[disabled] {
        background: @disabled-color;
        border: 2px solid @disabled-color;
      }
      width: .72rem;
      background: @base-black;
      color: @base-white;
    }
  }

  .current-address {
    line-height: .32rem;
    height: .32rem;
    width: 100%;
    cursor: pointer;
    font-size: .16rem;
    font-weight: bolder;
    span {
      margin-right: .3rem;
    }
    .show-current-list {
      position: relative;
      &:after {
        content: '';
        width: 100%;
        height: 2px;
        line-height: 2px;
        background: @base-gold;
        position: absolute;
        bottom: -.08rem;
        left: 0;
      }
    }
  }

  hr {
    width: 100%;
    height: 2px;
    background: #EEEEEE;
    margin-bottom: .2rem;
  }

  .list {
    max-height: calc(4 * (.48rem + .1rem));
    overflow-y: scroll;
    .component-list-item {
      width: 100%;
      line-height: .48rem;
      height: .48rem;
      cursor: pointer;
      font-size: .16rem;
      font-weight: bolder;
      i {
        display: none;
      }
      &.selected-list-item {
        color: @base-gold;
        i {
          display: inline-block;
        }
      }
    }

    .icon-selected {
      margin-top: .12rem;
    }
  }


</style>