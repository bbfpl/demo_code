<i18n src="./lang.json"></i18n>

<template>

  <div class="panel">
    <div class="container">
      <header-black-bg :backPath="'/user'" class="decrease-space">{{ $t('setting') }}</header-black-bg>

      <div class="user-setting-list">
        <template v-for="(item,index) in actionsList">
          <template v-if="item.path === '/message'">
            <div class="user-setting-item">
              <div class="flex flex-between">
                <p class="label">{{item.label}}</p>
                <div class="flex">
                  <span v-if="item.describe" class="describe">{{item.describe}}</span>
                  <switch-btn @click="switchNotification"></switch-btn>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <router-link :to="{path: item.path}">
              <div class="user-setting-item">
                <div class="flex flex-between">
                  <p class="label">{{item.label}}</p>
                  <div class="flex">
                    <span v-if="item.describe" class="describe">{{item.describe}}</span>
                    <p class="flex center">
                      <i class="icon-arrow-right"></i>
                    </p>
                  </div>
                </div>
              </div>
            </router-link>
          </template>
        </template>

        <div class="user-setting-item" @click="signOut">
          <div class="flex flex-between">
            <p class="label">{{$t('signOut')}}</p>
            <div class="flex">
              <p class="flex center">
                <i class="icon-arrow-right"></i>
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>

    <app-modal>
      <div slot="modal-header" class="modal-header">
        <p class="modal-title">{{ $t('confirmSignOut') }}</p>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button class="btn-default cancel" @click="cancelSignOut">{{ $t('cancel') }}</button>
        <button class="btn-default sure" @click="sureSignOut">{{ $t('sure') }}</button>
      </div>
    </app-modal>
  </div>

</template>

<script>
  import HeaderBlackBg from '@/components/header/HeaderBlackBg'
  import SwitchBtn from '@/components/SwitchBtn'
  import AppModal from '@/components/appModal/AppModal'

  export default {
    name: 'UserSettingPage',
    components: {
      HeaderBlackBg,
      SwitchBtn,
      AppModal
    },
    data() {
      return {
        isNotice: '',
        actionsList: [
          {
            path: '/account',
            label: this.$t('account')
          },
          // {
          //   path: '/message',
          //   label: this.$t('notice')
          // },
          // {
          //   path: '/setting',
          //   label: '语言/Language',
          //   describe: '简体中文'
          // },
          // {
          //   path: '/setting',
          //   label: '反馈建议'
          // },
          {
            path: '/privacy-policy',
            label: this.$t('privacyPolicy')
          },
          {
            path: '/about',
            label: this.$t('about')
          }
        ]
      }
    },
    methods: {
      switchNotification(status) {
        this.isNotice = status
      },
      signOut() {
        this.$store.commit('setShowModal', true)
      },
      cancelSignOut() {
        this.$store.commit('setShowModal', false)
      },
      sureSignOut() {
        this.$store.dispatch('signOut')
        this.$store.commit('setShowModal', false)
        this.$router.replace('/phone-login')
      }
    }
  }
</script>

<style rel="stylesheet/less" lang="less" scoped>
  @import './userSetting.less';
  @import '../../style/components/app-modal';
</style>
