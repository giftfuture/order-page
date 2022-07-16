import request from '@/utils/request'

// 获取员工列表
export function queryAllStaf (data) {
  return request({
    url: '/staf/queryAll',
    method: 'post',
    data
  })
}

// 发货组、开票和资料、打款组搜索分页
export function querySearch (data) {
  return request({
    url: '/order/querySearch',
    method: 'post',
    data
  })
}

// 订货组搜索分页
export function dhSearch (data) {
  return request({
    url: '/order/dhSearch',
    method: 'post',
    data
  })
}

// 进货组、价格组搜索分页
export function jhjgSearch (data) {
  return request({
    url: '/order/jhjgSearch',
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

// 单个编辑订单
export function editOrder (data) {
  return request({
    url: '/order/edit',
    method: 'post',
    data
  })
}

// 删除订单
export function delOrder (data) {
  return request({
    url: '/order/del',
    method: 'delete',
    data: { id: data }
  })
}
