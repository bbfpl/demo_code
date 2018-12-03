export default {
  en: {
    attributes: {
      password: '密码',
      confirmPassword: '确认密码',
      email: '邮箱',
      username: '用户名',
      oldPassword: '原密码',
      consignee: '收货人',
      phoneNumber: '联系电话',
      chooseArea: '区域',
      detailedAddress: '详细地址',
      safeCode: '验证码'
    },
    messages: {
      required: (field) => `${field}不能为空`,
      confirmed: (field, [confirm]) => `${field}与${confirm}内容不匹配`,
      min: (filed, [length]) => `${filed}不能小于${length}个字符`,
      email: (filed) => `${filed}格式不正确`,
      numeric: (filed) => `${filed}必须为数字`
    }
  },
  cn: {
    attributes: {
      password: 'Password',
      confirmPassword: 'Confirm password',
      email: '邮箱',
      username: 'Username',
      oldPassword: '原密码',
      consignee: '收货人',
      phoneNumber: '联系电话',
      chooseArea: '区域',
      detailedAddress: '详细地址',
      safeCode: '验证码'
    },
    messages: {
      required: (field) => field + '不能为空',
      confirmed: (field) => `The ${field} confirmation does not match.`,
      min: (filed, [length]) => `The ${filed} field must be at least ${length} characters.`,
      email: (filed) => `${filed}格式不正确`,
      numeric: (filed) => `${filed}必须为数字`
    }
  }
}