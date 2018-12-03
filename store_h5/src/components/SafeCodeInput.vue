<template>
  <div class="verification-input-box">
    <input type="tel" v-for="(codeItem, index) in codeArr" name="safeCode"
           class="text-center verification-code" data-vv-as="safeCodes"
           v-model="codeItem.code"
           v-validate="'numeric'"
           v-on:keyup="validateInput($event, index)"
           @focus="setInputFocusStatus(index)"
           @blur="setInputBlurStatus(index)"
           v-focus="codeItem.focusState">
  </div>
</template>

<script>
  export default {
    name: 'SafeCodeInput',
    props: ['resetSafeCode'],
    data() {
      return {
        codeArr: [
          {
            code: '',
            focusState: false
          },
          {
            code: '',
            focusState: false
          },
          {
            code: '',
            focusState: false
          },
          {
            code: '',
            focusState: false
          }
        ]
      }
    },
    computed: {
      safeCode() {
        let arr = this.codeArr
        return arr[0].code + arr[1].code + arr[2].code + arr[3].code
      }
    },
    watch: {
      safeCode() {
        let reg = /^[0-9]{4}$/
        let safeCode = this.safeCode
        if (this.safeCode.length === 4 && reg.test(safeCode)) {
          let that = this
          setTimeout(function () {
            that.$emit('safeCodeFull', that.safeCode)
          }, 200)
        }
      },
      resetSafeCode() {
        if (this.resetSafeCode) {
          this.codeArr[0].code = ' '
          for (let i = 0; i < 4; i++) {
            this.codeArr[i] = {
              code: '',
              focusState: false
            }
          }
          this.$emit('resetSuccess')
        }
      },
      errors() {
        console.log('errors', this.errors)
      }
    },
    methods: {
      validateInput(event, index) {
        let currentInputVal = this.codeArr[index].code
        let strLength = String(currentInputVal).length
        if (strLength > 1) {
          this.codeArr[index].code = currentInputVal.substring(0, 1)
        }

        let reg = /^[0-9]*$/
        let validationHasErrors = event.key !== 'Backspace' && !reg.test(event.key)
        if (validationHasErrors) {
          this.$set(this.codeArr, index, {
            code: '',
            focusState: true
          })
        } else if (event.key === 'Backspace') {
          this.setInputAutoFocus(index, index - 1)
        } else if (strLength > 0) {
          this.setInputAutoFocus(index, index + 1)
        }
      },
      setInputAutoFocus(currentIndex, setIndex) {
        if (setIndex < 0 || setIndex > 3) return
        this.codeArr[currentIndex].focusState = false
        this.codeArr[setIndex].focusState = true
      },
      setInputFocusStatus(index) {
        for (let i in this.codeArr) {
          if (i === index) {
            this.codeArr[i].focusState = true
          } else {
            this.codeArr[i].focusState = false
          }
        }
      },
      setInputBlurStatus(index) {
        this.codeArr[index].focusState = false
      }
    },
    directives: {
      focus: {
        update: function (el, {value}) {
          if (value) {
            el.focus()
          }
        }
      }
    }
  }
</script>

<style rel="stylesheet/less" lang="less" scoped>
  .verification-input-box {
    display: flex;
    justify-content: space-between;
    .verification-code {
      display: inline-block;
      width: .69rem;
      border-bottom: 2px solid #000000;
      line-height: .46rem;
      margin-bottom: .3rem;
      font-size: .48rem;
    }
  }
</style>