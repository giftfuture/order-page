import request from '@/utils/request'

// 获取订单列表
export function getOrderList (data) {
  return request({
    url: '/order/list',
    method: 'post',
    data
  })
}
// 获取员工列表
export function queryAllStaf (data) {
  return request({
    url: '/staf/queryAll',
    method: 'post',
    data
  })
}
