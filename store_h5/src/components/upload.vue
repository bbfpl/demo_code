<template>
  <div class="oss_file">
    <button class="change-btn">修改</button>
    <input class="real-input" type="file" :id="id" @change="doUpload" accept="image/*"/>

    <div class="loading-button text-center flex flex-middle flex-center" v-show="avatarChanging">
      <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
      <path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
      <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"></animateTransform>
      </path>
      </svg>
    </div>

    <span class="hover_show_icon">
      <i></i>
    </span>
    <p>
      <!-- 上传进度 {{percentage}} -->
      <!-- {{percentage===1?"success!":(percentage===0?'waiting...':'uploading')}} -->
    </p>
  </div>
</template>

<script>
  import api from '@/config/api'
  import http from '@/utils/http'
  import interceptor from '@/utils/interceptor'
  import Picture from '@/utils/image'

  export default {
    name: 'upload',
    data() {
      return {
        region: 'oss-cn-hangzhou',
        bucket: 'storage-pandaearth',
        id: 'upload',
        percentage: 0,
        url: '',
        imagePath: ''
      }
    },
    computed: {
      avatarChanging() {
        return this.$store.state.changeAvatar.avatarChanging
      }
    },
    methods: {
      doUpload() {
        const _this = this
        _this.$store.commit('SET_AVATAR_CHANGE_STATUS', true)
        const urls = []
        // get 获取 oss AccessKeyId AccessKeySecret SecurityToken
        http.get(api.APIS.getOssTicket, interceptor.httpConfig()).then(data => {
          if (data) {
            let _data = data.data.data

            let result = _data.Credentials
            const client = new OSS.Wrapper({
              region: _this.region,
              accessKeyId: result.AccessKeyId,
              accessKeySecret: result.AccessKeySecret,
              stsToken: result.SecurityToken,
              bucket: _this.bucket,
              secure: true
            })

            _this.percentage = 0

            const files = document.getElementById(_this.id)

            if (files.files) {
              const fileLen = files.files
              let resultUpload = ''

              for (let i = 0; i < fileLen.length; i++) {
                // 获取 第一个图片文件
                const file = fileLen[i]

                // // 随机命名
                let random_name = this.random_string(6) + '_' + new Date().getTime() + '.' + file.name.split('.').pop()

                if (file.name.split('.').pop() == 'svg') {
                  _this.$store.dispatch('pushNotification', {notice: _this.$t('lang.pictureFormatError')})
                  _this.$store.commit('SET_AVATAR_CHANGE_STATUS', false)
                  return false
                }
                // // put 到 oss 目录
                let storeAs = 'temps/' + this.getDate() + '/' + random_name

                Picture.fileToDataURL(file, function (base64Content) {
                  if (base64Content.indexOf('data:image') === 0) {
                    const imgfile = Picture.dataURLtoFile(base64Content, 'img.png')
                    // blob转arrayBuffer
                    Picture.blobToArrayBuffer(imgfile, function (arrayBuffer) {
                      // arrayBuffer转Buffer
                      let buffer = new OSS.Buffer(arrayBuffer)
                      // put 数据到oss
                      client.put(storeAs, buffer).then(function (result) {
                        console.log(result)
                        _this.$store.commit('SET_URL', result.name)
                        _this.$store.commit('SET_IMAGE_PATH', result.url)
                        _this.url = result.name
                        _this.imagePath = result.url
                        _this.uploadSuccess({
                          url: _this.url,
                          imagePath: _this.imagePath
                        })
                      }).catch(function (err) {
                        console.log(err)
                        _this.$store.dispatch('pushNotification', {notice: err})
                        _this.$store.commit('SET_AVATAR_CHANGE_STATUS', false)
                      })
                    })
                  } else {
                    console.log('Please fill in the correct Base64 img')
                    _this.$store.dispatch('pushNotification', {notice: 'Please fill in the correct Base64 img'})
                    _this.$store.commit('SET_AVATAR_CHANGE_STATUS', false)
                  }
                  // Picture.compressDataURL(dataURL,{
                  //    w:3,
                  //    h:3
                  // },function (base64Content)  {
                  //    if (base64Content.indexOf('data:image') === 0) {
                  //      const imgfile = Picture.dataURLtoFile(base64Content, 'img.png');
                  //      // blob转arrayBuffer
                  //      Picture.blobToArrayBuffer(imgfile,function(arrayBuffer){
                  //        // arrayBuffer转Buffer
                  //        let buffer = new OSS.Buffer(arrayBuffer);
                  //        //put 数据到oss
                  //        client.put(storeAs, buffer).then(function(result){
                  //          console.log(result);
                  //            _this.url = result.name;
                  //            _this.imagePath  = result.url;
                  //            _this.uploadSuccess({
                  //              url:_this.url,
                  //              imagePath:_this.imagePath
                  //            });
                  //        }).catch(function(err){
                  //          console.log(err);
                  //        });
                  //      })
                  //    } else {
                  //      console.log('Please fill in the correct Base64 img');
                  //    }
                  // });
                })
              }
            }
          }
        })
      },
      // 随机生成文件名
      random_string(len) {
        len = len || 32
        var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
        var maxPos = chars.length
        var pwd = ''
        for (let i = 0; i < len; i++) {
          pwd += chars.charAt(Math.floor(Math.random() * maxPos))
        }
        return pwd
      },
      getDate() {
        var datetime = new Date().getTime()
        let time = new Date(datetime)
        let y = time.getFullYear()
        let m = time.getMonth() + 1
        let d = time.getDate()
        return y + '/' + m + '/' + d
      },
      uploadSuccess(data) {
        console.log(data)
        this.$emit('upFunc', data)
      }
    },
    watch: {
      url(val) {

      }
    }
  }
</script>
<style rel="stylesheet/less" lang="less" scoped>
  @import "../style/components/base-button";

  .oss_file {
    position: absolute;
    border-radius: .28rem;
    overflow: hidden;
  }

  .change-btn {
    .base-button-little();
  }

  .loading-button {
    min-height: 50px;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 9;
    background-color: rgba(247, 247, 247, 0.9);
  }

  .real-input {
    .base-button-little();
    position: absolute;
    top: 0;
    left: 0;
    background: transparent;
    color: transparent;
    outline: none;
    opacity: 0;
    -ms-filter: 'alpha(opacity=0)';
  }
</style>