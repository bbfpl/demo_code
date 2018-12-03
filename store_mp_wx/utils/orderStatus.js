  function getStatus(value) {
    let data = {}
    let is_paid = value.is_paid // 支付
    let is_closed = value.is_closed // 关闭
    let logistics_state = value.logistics_state // 发货
    let refund_state = value.refund_state // 退款

    // 未付款 未关闭 (按钮:立即付款)
    if (is_paid === false && is_closed === false) {
      data.text = '未付款'
      data.status = 1
    }
    // 未付款 已关闭 (按钮:无)
    if (is_paid === false && is_closed === true) {
      data.text = '已关闭'
      data.status = 2
    }
    // 已付款 未关闭 (按钮:无)
    if (is_paid === true && is_closed === false && logistics_state === 'None' && refund_state === 'None') {
      data.text = '已付款'
      data.status = 3
    }
    // 已付款 已发货 没有关闭和退款 (按钮:确认收货 查看物流)
    if (is_paid === true && is_closed === false && logistics_state === 'Sended' && refund_state === 'None') {
      data.text = '已发货'
      data.status = 4
    }
    // 已付款 已发货 没有关闭和退款 (按钮:查看退款)
    if (is_paid === true && (refund_state === 'Part' || refund_state === 'All')) {
      data.text = '退款中'
      data.status = 5
    }
    // 已付款 已发货 已关闭 或者 已经退款 (按钮:无)
    if (is_paid === true && is_closed === true && logistics_state === 'Sended' && (refund_state === 'Part' || refund_state === 'All')) {
      data.text = '退款成功'
      data.status = 6
    }

    return data
  }

module.exports = {
  getStatus: getStatus
}
