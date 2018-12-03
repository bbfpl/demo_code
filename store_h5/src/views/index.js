module.exports = {
  phoneLogin: require('./phoneLogin/PhoneLogin.vue'),
  emailLogin: require('./emailLogin/EmailLogin'),
  redirect: require('./redirect/Redirect'),
  welcome: require('./welcome/Welcome.vue'),
  selectArea: require('./selectArea/SelectArea.vue'),
  enterPassword: require('./enterPassword/EnterPassword'),
  resetPassword: require('./resetPassword/ResetPassword'),
  enterSafeCode: require('./enterSafeCode/EnterSafeCode'),
  setPassword: require('./setPassword/SetPassword'),
  bindPhone: require('./bindPhone/BindPhone'),
  changeAvatar: require('./changeAvatar/ChangeAvatar'),
  changeUsername: require('./changeUsername/ChangeUsername'),
  changePassword: require('./changePassword/ChangePassword'),
  // 地址
  address: require('./address/Address'),
  // 地址-新增
  addAddress: require('./address/add/AddAddress'),
  // 地址-编辑
  editAddress: require('./address/edit/EditAddress'),
  // 列表-地址
  addressList: require('./address/list/AddressList'),
  // 修改手机号
  changePhoneNumber: require('./changePhoneNumber/ChangePhoneNumber'),
  // 修改手机号-安全码
  changePhoneSafeCode: require('./changePhoneNumber/ChangePhoneSafeCode'),
  privacyPolicy: require('./privacyPolicy/PrivacyPolicy'),
  accountAndSafe: require('./accountAndSafe/AccountAndSafe'),
  about: require('./about/About'),
  feedback: require('./feedback/Feedback'),
  // 账户余额
  balance: require('./balance/Balance'),
  // 充值
  topUp: require('./topUp/TopUp'),
  // 提现
  withdraw: require('./withdraw/Withdraw'),
  // 提现成功
  withdrawSuccess: require('./withdrawSuccess/WithdrawSuccess'),
  // 账户明细
  accountDetails: require('./accountDetails/AccountDetails'),
  // 编辑银行卡
  editBankCard: require('./editBankCard/EditBankCard'),
  // 兑现
  toCash: require('./toCash/Index'),
  // 确认兑现
  confirmToCash: require('./toCash/confirmToCash/ConfirmToCash'),
  // 兑现成功
  toCashSuccess: require('./toCash/toCashSuccess/ToCashSuccess'),

  // bobby
  // 欢迎页-首次使用
  homeWelcome: require('./home/homeWelcome.vue'),
  // 首页
  home: require('./home/home.vue'),
  // token饰品详情页
  detail: require('./detail/detail.vue'),
  // 定制天使熊猫
  customized: require('./customized/customized.vue'),
  // 定制天使熊猫结果页
  customizedResult: require('./customizedResult/customizedResult.vue'),
  // 我的主页
  user: require('./user/user.vue'),
  // 我的主页-熊猫
  userPanda: require('./user/userPanda.vue'),
  // 我的主页-资产
  userAssets: require('./user/userAssets.vue'),
  // 我的主页-订单
  userOrder: require('./user/userOrder.vue'),
  // 我的主页-订单详情
  userOrderDetail: require('./user/userOrderDetail.vue'),
  // 我的主页-订单物流
  userOrderExpress: require('./user/userOrderExpress.vue'),
  // 我的主页-消息
  userMessage: require('./user/userMessage.vue'),
  // 熊猫-详情页
  pandaDetail: require('./pandaDetail/pandaDetail.vue'),
  // 探索
  explore: require('./explore/explore.vue'),
  // 交易记录
  record: require('./transactionRecord/record.vue'),
  // 交易市场产品详情
  marketDetail: require('./market/detail.vue'),
  // 交易市场
  market: require('./market/market.vue'),
  // 交易市场系列
  marketList: require('./market/marketList.vue'),
  // 交易市场-介绍
  marketIntro: require('./market/marketIntro.vue'),
  // 交易市场-出售购买
  marketSellBuy: require('./market/sellBuy.vue'),
  // 交易市场-回调页面
  marketCallback: require('./market/callback.vue'),
  // 交易市场-提货
  marketPickUpGoods: require('./market/pickUpGoods.vue'),
  // 繁殖市场
  breedingMarket: require('./breedingMarket/breedingMarket.vue'),
  // 繁殖市场-介绍
  breedingMarketIntro: require('./breedingMarket/breedingMarketUnopen.vue'),
  // 繁殖市场-错误提示页
  breedingMarketError: require('./breedingMarket/breedingMarketError.vue'),
  // 繁殖预测
  breedingPrediction: require('./breedingMarket/breedingPrediction.vue'),
  // 设置
  userSetting: require('./userSetting/userSetting.vue'),
  // 支付下单
  buy: require('./buy/buy.vue'),
  // 完成下单
  buyNow: require('./buy/buyNow.vue'),
  // 支付
  pay: require('./buy/pay.vue'),
  // 支付成功
  paySuccess: require('./buy/paySuccess.vue'),
  // 支付失败
  payError: require('./buy/payError.vue'),
  // 搜索熊猫
  searchPandas: require('./search/searchPandas.vue'),
}