import Vue from 'vue'
import Router from 'vue-router'
import RouterBobby from './router.bobby'

Vue.use(Router)

let views = pageName => resolve => require(['@/views/'], pages => resolve(pages[pageName]))

const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition
  } else {
    const position = {}
    if (to.hash) {
      position.selector = to.hash
    }
    if (to.matched.some(m => m.meta.scrollToTop)) {
      position.x = 0
      position.y = 0
    }
    return position
  }
}

let routes = [
  ...RouterBobby, {
    path: '/welcome',
    name: 'welcome',
    component: views('welcome'),
    meta: {
      title: 'welcome'
    }
  }, {
    path: '/phone-login',
    name: 'phoneLogin',
    component: views('phoneLogin'),
    meta: {
      title: 'phoneLogin'
    }
  }, {
    path: '/email-login',
    name: 'emailLogin',
    component: views('emailLogin'),
    meta: {
      title: 'emailLogin'
    }
  }, {
    path: '/redirect',
    name: 'redirect',
    component: views('redirect'),
    meta: {
      title: 'redirect'
    }
  }, {
    path: '/select-area',
    name: 'selectArea',
    component: views('selectArea'),
    meta: {
      title: 'selectArea'
    }
  }, {
    path: '/enter-password',
    name: 'enterPassword',
    component: views('enterPassword'),
    meta: {
      title: 'enterPassword'
    }
  }, {
    path: '/reset-password',
    name: 'resetPassword',
    component: views('resetPassword'),
    meta: {
      title: 'resetPassword'
    }
  },
  {
    path: '/enter-safe-code',
    name: 'enterSafeCode',
    component: views('enterSafeCode'),
    meta: {
      title: 'enterSafeCode'
    }
  },
  {
    path: '/set-password',
    name: 'setPassword',
    component: views('setPassword'),
    meta: {
      title: 'setPassword'
    }
  },
  {
    path: '/bind-phone',
    name: 'bindPhone',
    component: views('bindPhone'),
    meta: {
      title: 'bindPhone'
    }
  },
  {
    path: '/change-avatar',
    name: 'changeAvatar',
    component: views('changeAvatar'),
    meta: {
      title: 'changeAvatar'
    }
  },
  {
    path: '/change-username',
    name: 'changeUsername',
    component: views('changeUsername'),
    meta: {
      title: 'changeUsername'
    }
  },
  {
    path: '/change-password',
    name: 'changePassword',
    component: views('changePassword'),
    meta: {
      title: 'changePassword'
    }
  },
  {
    path: '/address',
    name: 'address',
    component: views('address'),
    redirect: '/address/list',
    children: [{
      path: 'list',
      name: 'addressList',
      component: views('addressList'),
      meta: {
        title: 'addressList'
      }
    }, {
      path: 'add',
      name: 'addAddress',
      component: views('addAddress'),
      meta: {
        title: 'addAddress'
      }
    }, {
      path: 'edit/:addressId',
      name: 'editAddress',
      component: views('editAddress'),
      meta: {
        title: 'editAddress'
      }
    }]
  },
  {
    path: '/change-phone-number',
    name: 'changePhoneNumber',
    component: views('changePhoneNumber'),
    meta: {
      title: 'changePhoneNumber'
    }
  }, {
    path: '/change-phone-safe-code',
    name: 'changePhoneSafeCode',
    component: views('changePhoneSafeCode'),
    meta: {
      title: 'changePhoneSafeCode'
    }
  }, {
    path: '/privacy-policy',
    name: 'privacyPolicy',
    component: views('privacyPolicy'),
    meta: {
      title: 'privacyPolicy'
    }
  }, {
    path: '/about',
    name: 'about',
    component: views('about'),
    meta: {
      title: 'about'
    }
  }, {
    path: '/feedback',
    name: 'feedback',
    component: views('feedback'),
    meta: {
      title: 'feedback'
    }
  }, {
    path: '/account',
    name: 'accountAndSafe',
    component: views('accountAndSafe'),
    meta: {
      title: 'accountAndSafe'
    }
  },
  {
    path: '/balance',
    name: 'balance',
    component: views('balance'),
    meta: {
      title: 'balance'
    }
  },
  {
    path: '/topup',
    name: 'topUp',
    component: views('topUp'),
    meta: {
      title: 'topUp'
    }
  },
  {
    path: '/withdraw',
    name: 'withdraw',
    component: views('withdraw'),
    meta: {
      title: 'withdraw'
    }
  },
  {
    path: '/withdraw/success',
    name: 'withdrawSuccess',
    component: views('withdrawSuccess'),
    meta: {
      title: 'withdrawSuccess'
    }
  },
  {
    path: '/account-details',
    name: 'accountDetails',
    component: views('accountDetails'),
    meta: {
      title: 'accountDetails'
    }
  },
  {
    path: '/edit-bank-card',
    name: 'editBankCard',
    component: views('editBankCard'),
    meta: {
      title: 'editBankCard'
    }
  },
  {
    path: '/to-cash',
    name: 'toCash',
    component: views('toCash'),
    children: [
      {
        path: '/confirm-to-cash/:id',
        name: 'confirmToCash',
        component: views('confirmToCash'),
        meta: {
          title: 'confirmToCash'
        }
      },
      {
        path: '/to-cash-success',
        name: 'toCashSuccess',
        component: views('toCashSuccess'),
        meta: {
          title: 'toCashSuccess'
        }
      }
    ]
  },
  {path: '/*', redirect: '/home'}
]

export default new Router({
  routes: routes,
  mode: 'history',
  scrollBehavior
})