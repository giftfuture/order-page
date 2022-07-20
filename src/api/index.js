import request from '@/utils/request'

// 获取员工列表
export function queryAllStaf (data) {
  return request({
    url: '/staf/queryAll',
    method: 'post',
    data
  })
}

// 工单组搜索分页
export function querySearch (data) {
  return request({
    url: '/order/querySearch',
    method: 'post',
    data
  })
}

// 综合搜索
export function overallSearch (data) {
  return request({
    url: '/order/overallSearch',
    method: 'post',
    data
  })
}

// 获取订单和发票资料状态
export function loadBySort (data) {
  return request({
    url: '/dict/loadBySort' + (data ? `?sortTag=${data}` : ''),
    method: 'get'
  })
}

// 批量编辑订单状态
export function editListOrder (data) {
  return request({
    url: '/order/editList',
    method: 'post',
    data
  })
}

// 编辑订单
export function editOrder (data) {
  return request({
    url: '/order/editOne',
    method: 'post',
    data
  })
}

// 单个编辑订单
export function editOrderOne (data) {
  return request({
    url: '/order/editOne',
    method: 'post',
    data
  })
}

// 创建订单
export function createOrder (data) {
  return request({
    url: '/order/create',
    method: 'put',
    data
  })
}

// 删除工单
export function delOrder (id) {
  return request({
    url: '/order/del?id=' + id,
    method: 'delete'
  })
}

// 工单分类
export function fetchAllSort () {
  return request({
    url: '/sort/fetchAll',
    method: 'get'
  })
}
// 文本转换
export function exchangeFunc (data) {
  return request({
    url: '/data/exchange',
    method: 'post',
    data
  })
}
// 操作日志
export function operLog (data) {
  return request({
    url: '/log/' + data,
    method: 'get'
  })
}
