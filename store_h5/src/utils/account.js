// import store from '@/utils/store'
import passport from '@/utils/passport'
export default {
  isLogin(vm) {
    if (!passport.hasAuthToken()) {
      vm.$router.push('/phoneEmail')
      return false
    } else {
      return true
    }
  }
}
